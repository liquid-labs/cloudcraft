variable "billing_account_id" {
  description = "ID of the billing account to use for the project."
  type = string
  nullable = false
}
variable "vm_managers" {
  description = "Name of group with permisions to activate and deactivate the server."
  type = string
  default = "cloudcraft-users"
}
variable "network_name" {
  description = "The name of the network the server resides in."
  type = string
  default = "cloudcraft-network"
  nullable = false
}
variable "org_id" {
  description = "The name of hosting organization's ID."
  type = string
  nullable = false
}
variable "region" {
  description = "The region where to build the project."
  type = string
  default = "us-central1"
  nullable = false
}
variable "server_type" {
  description = "Takes 'java' or 'bedrock'."
  default = "bedrock"
  nullable = false
}
variable "zone" {
  description = "The zone where to build the project."
  type = string
  default = "us-central1-c"
  nullable = false
}
# passthrough vars
variable "servers" {
  description = "A map of the server configurations."
  type = map(
    object({
      server_memory = optional(string)
      data_disk_size = optional(string)
      host_image = optional(string)
      internal_ip = string
      machine_type = optional(string),
      server_type = optional(string)
    })
  )
}