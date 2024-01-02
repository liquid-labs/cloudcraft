output "ip_address" {
  value = google_compute_address.cloudcraft_ip.address
  description = "Data on the IP address created for the VM."
}
output "host_image" {
  value = var.host_image
  description = "The image to use for the base VM."
}
output "data_disk_size" {
  value = var.data_disk_size
  description = "The size of the base VM root disk, in GB."
}
output "machine_type" {
  value = var.machine_type
  description = "Type of the base VM."
}
output "server_type" {
  value = var.server_type
  description = "The type of Minecraft server hosted."
}
output "server_memory" {
  value = var.server_memory
  description = "Memory of the hosted VM / Minecraft server."
}
output "internal_ip" {
  value = var.internal_ip
  description = "Internal IP address."
}

