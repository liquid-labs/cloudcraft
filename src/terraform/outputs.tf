
output "project_id" {
  value = random_id.project_id.hex
  description = "The project ID."
}
output "zone" {
  value = var.zone
  description = "The resource zone"
}
output "servers" {
  value = module.vm_instance
  description = "The information on each of the servers."
}
