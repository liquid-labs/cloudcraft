terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = ">= 4.27.0"
    }
  }
}

locals {
  server_image = "${var.server_type == "bedrock" ? "itzg/minecraft-bedrock-server" : "itzg/minecraft-server"}"
  server_protocol = "${var.server_type == "bedrock" ? "udp" : "tcp"}"
  ext_port = "${var.server_type == "bedrock" ? 19132 : 25565}"
  docker_lib_dir = "/var/lib/docker"
  host_bind_dir = {
    value = "${local.docker_lib_dir}/cloudcraft"
    description = "The path on the host instance to bind to the container's '/data' dir where all the world and other server state files are stored. Because the container optimized image limits '/var' in general with noexec, we store it under the docker working dir because it is stateful and allows execution. Refer to: https://cloud.google.com/container-optimized-os/docs/concepts/security#filesystem for details on the COS mount permissions."
  }
}

# Permenant IP address, stays around when VM is off
resource "google_compute_address" "cloudcraft_ip" {
  name = "cloudcraft-ip-${var.name}"
  project = var.project_id
}

  # Permenant Minecraft disk, stays around when VM is off
resource "google_compute_disk" "cloudcraft_boot_disk" {
  name = "cloudcraft-boot-disk-${var.name}"
  type = "pd-standard"
  image = var.host_image
  project = var.project_id
}

resource "google_compute_disk" "cloudcraft_data_disk" {
  name = "cloudcraft-data-disk-${var.name}"
  type = "pd-standard"
  size = var.data_disk_size
  lifecycle {
    prevent_destroy = false
  }
  project = var.project_id
}

resource "google_compute_instance" "cloudcraft_host" {
  description = "Hosts the cloudcraft server container."
  name = "cloudcraft-host-${var.name}"
  machine_type = var.machine_type
  tags = ["cloudcraft", "ssh"]
  allow_stopping_for_update = true
  metadata = {
    enable-oslogin = "TRUE"
  }
  boot_disk {
    auto_delete = true
    source = google_compute_disk.cloudcraft_boot_disk.self_link
  }
  attached_disk {
    source = google_compute_disk.cloudcraft_data_disk.self_link
    device_name = google_compute_disk.cloudcraft_data_disk.name
  }
  metadata_startup_script = <<-EOT
    {
      echo "Starting at $(date)"
      if ! [ -d ${local.host_bind_dir.value} ]; then
        mkdir -p ${local.host_bind_dir.value}
        mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard \
          /dev/disk/by-id/google-${google_compute_disk.cloudcraft_data_disk.name}
        mount -o discard,defaults \
          /dev/disk/by-id/google-${google_compute_disk.cloudcraft_data_disk.name} \
          ${local.host_bind_dir.value}
      fi
      chmod a+rx ${local.docker_lib_dir}
      chmod a+rw ${local.host_bind_dir.value}

      echo "
    # credit to https://www.redhat.com/sysadmin/systemd-automate-recovery
    # credit to https://gist.github.com/dotStart/ea0455714a0942474635
    [Unit]
    Description=cloudcraft-server
    # Try 8 times, waiting 15 seconds in between each before giving up (2 min total)
    StartLimitIntervalSec=15
    StartLimitBurst=8
    # Call cleanup script if necessary:
    # OnFailure=my-app-recovery.service

    [Service]
    User=root
    WorkingDirectory=/var/lib/docker
    ExecStartPre=-docker stop mc
    ExecStartPre=-docker rm mc
    ExecStart=/bin/bash -c 'docker run \
      --detach \
      --interactive \
      --tty \
      -p ${local.ext_port}:${local.ext_port}/${local.server_protocol} \
      -e EULA=TRUE \
      -e VERSION=LATEST \
      -v ${local.host_bind_dir.value}:/data \
      --name mc \
      -e MEMORY=${var.server_memory} \
      ${local.server_image}:latest >> /var/log/mc-docker-run.log 2>&1'
    ExecStop=-docker stop mc
    ExecStopPost=-docker rm mc
    Type=oneshot
    RemainAfterExit=yes
    Restart=on-failure
    
    [Install]
    WantedBy=multi-user.target" > /etc/systemd/system/cloudcraft.service && systemctl enable cloudcraft && systemctl start cloudcraft
    } >> /var/log/startup-script.log 2>&1
  EOT
  
  network_interface {
    network = var.network.id
    subnetwork = var.subnet.id
    network_ip = var.internal_ip # 10.2.0.100
    access_config {
      nat_ip = google_compute_address.cloudcraft_ip.address
    }
  }
  can_ip_forward = true
  service_account {
    email = "cloudcraft-service-acct@${var.project_id}.iam.gserviceaccount.com"
    scopes = ["userinfo-email"]
  }
  scheduling {
    preemptible = true # Closes within 24 hours (sometimes sooner)
    automatic_restart = false
    provisioning_model = "SPOT"
    instance_termination_action = "STOP"
  }
  project = var.project_id
}