locals {
  bedrock_port = "19132"
  java_port    = "25565"
}

terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.27.0"
    }
    random = {
      source = "hashicorp/random"
      version = ">=3.6.0"
    }
  }
}

provider "google" {
  # project: ${random_id.project_id.hex}
  region = var.region
  zone   = var.zone
}

provider "random" {}

resource "random_id" "project_id" {
  byte_length = 8
  prefix      = "cloudcraft-"
}

# Create a project where the resources live
resource "google_project" "cloudcraft-project" {
  name                = random_id.project_id.hex
  project_id          = random_id.project_id.hex
  org_id              = var.org_id
  billing_account     = var.billing_account_id # billing is required to enable the googleapis
  auto_create_network = false
}

# Enable services.
resource "google_project_service" "compute_api" {
  project    = random_id.project_id.hex
  service    = "compute.googleapis.com"
  depends_on = [google_project.cloudcraft-project]
}

# Create service account to run service with no permissions
resource "google_service_account" "cloudcraft_service_acct" {
  account_id   = "cloudcraft-service-acct"
  display_name = "cloudcraft_runner"
  project      = random_id.project_id.hex
  depends_on   = [google_project.cloudcraft-project]
}

# Create a private network so the cloudcraft instance cannot access any other resources.
resource "google_compute_network" "cloudcraft_network" {
  name                    = var.network_name
  auto_create_subnetworks = false
  project                 = random_id.project_id.hex
  depends_on              = [google_project.cloudcraft-project, google_project_service.compute_api]
}

resource "google_compute_subnetwork" "cloudcraft_subnet" {
  name          = "cloudcraft-subnet"
  ip_cidr_range = "10.2.0.0/16"
  region        = var.region
  network       = google_compute_network.cloudcraft_network.id
  project       = random_id.project_id.hex
}

resource "google_compute_firewall" "ssh" {
  name    = "ssh"
  network = var.network_name
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ssh"]
  project       = random_id.project_id.hex
  depends_on    = [google_project.cloudcraft-project, google_compute_network.cloudcraft_network]
}

resource "google_compute_firewall" "ping" {
  name    = "ping"
  network = var.network_name
  allow {
    protocol = "icmp" # ping
  }
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  project       = random_id.project_id.hex
  depends_on    = [google_project.cloudcraft-project, google_compute_network.cloudcraft_network]
}

resource "google_compute_firewall" "cloudcraft_service" {
  name = "cloudcraft-service"
  network = var.network_name
  # TODO: In theory, this is dependent on the types of servers being run, but we don't have knowledge of that at 
  # this level so it's not clear how to restrict this in a multi-server setup.
  allow {
    protocol = "tcp"
    # TODO: do we need the bedrock port here or is it pure UDP?
    ports = [local.bedrock_port, local.java_port]
  }
  allow {
    protocol = "udp"
    # TODO: do we need the java port here, or is it pure UDP?
    ports = [local.bedrock_port, local.java_port]
  }
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["cloudcraft"]
  project       = random_id.project_id.hex
  depends_on    = [google_project.cloudcraft-project, google_compute_network.cloudcraft_network]
}

resource "google_project_iam_custom_role" "cloudcraft_switcher" {
  role_id     = "cloudcraft_switcher"
  title       = "Minecraft Switcher"
  description = "Can turn a VM on and off"
  permissions = ["compute.instances.start", "compute.instances.stop", "compute.instances.get"]
  project     = random_id.project_id.hex
  depends_on  = [google_project.cloudcraft-project]
}
resource "google_project_iam_custom_role" "instance_lister" {
  role_id     = "cloudcraft_instances_lister"
  title       = "Instance Lister"
  description = "Can list VMs in project"
  permissions = ["compute.instances.list"]
  project     = random_id.project_id.hex
  depends_on  = [google_project.cloudcraft-project]
}

#  google_compute_instance_iam_binding:
#    switcher:
#      project: ${random_id.project_id.hex}
#      zone: ${var.zone}
#      instance_name: "${google_compute_instance.cloudcraft_host.name}"
#      role: "${google_project_iam_custom_role.cloudcraft_switcher.id}"
#      members:
#        - "group:${var.vm_managers}"

#  google_project_iam_member:
#    projectBrowsers:
#      project: ${random_id.project_id.hex}
#      role: roles/browser
#      member: group:${var.vm_managers}
#    computeViewer:
#      project: ${random_id.project_id.hex}
#      role: "${google_project_iam_custom_role.instance_lister.id}" # roles/cloudcraft_instances_lister
#      member: "group:${var.vm_managers}"
# end resources

module "vm_instance" {
  for_each = var.servers

  source     = "./modules/vm-instance"
  depends_on = [google_project.cloudcraft-project, google_compute_network.cloudcraft_network, google_compute_subnetwork.cloudcraft_subnet]

  # input vars
  project_id = random_id.project_id.hex
  name       = each.key
  # disk vars
  host_image     = each.value.host_image
  data_disk_size = each.value.data_disk_size
  # vm vars
  machine_type  = each.value.machine_type
  server_type   = each.value.server_type
  server_memory = each.value.server_memory
  # network vars
  internal_ip = each.value.internal_ip
  network     = google_compute_network.cloudcraft_network
  subnet      = google_compute_subnetwork.cloudcraft_subnet
}