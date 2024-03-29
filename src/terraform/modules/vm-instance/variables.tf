variable "project_id" {
  description = "The project ID."
  nullable    = false
}
variable "name" { # used to create unique ip, disk, and host names
  description = "Name cloudcraft server instance."
  nullable    = false
}
# disk vars
variable "host_image" {
  description = "Reference to base image."
  type        = string
  # TODO = "use google_compute_image data source to dynamically pull the latest
  default  = "projects/cos-cloud/global/images/cos-109-17800-66-32"
  nullable = false
}
variable "data_disk_size" {
  description = "The size of the base host disk in GB."
  type        = number
  default     = 10 # this is the size of the cos-109-lts image
  nullable    = false
}
# vm vars
variable "machine_type" {
  description = "The instance type to use for the cloudcraft server."
  type        = string
  default     = "n1-standard-1" # has 7.5G memory
  nullable    = false
}
variable "server_type" {
  description = "The Minecraft server type to launch."
  default     = "bedrock"
  nullable    = false
}
variable "server_memory" {
  description = "The amount of memory to dedicate to the Docker-based Minecraft server."
  type        = string
  default     = "6.5G" # leaves 1G in default setup
  nullable    = false
}
variable "internal_ip" {
  description = "Where to connect to the internal network."
  nullable    = false
}
variable "network" {
  description = "The network resource where the host resides."
  nullable    = false
}
variable "subnet" {
  description = "The subnet resource where the host resides."
  nullable    = false
}