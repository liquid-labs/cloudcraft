variable "project" { }

variable "credentials_file" { }

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}

terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.27.0"
    }
  }
}

provider "google" {
  project = var.project_id
  
  region  = var.region
  zone    = var.zone
}

module "org-policy" {
  source            = "terraform-google-modules/org-policy/google"
  version           = "5.1.0"

  organization_id   = var.org_id
  
  constraint        = "constraints/serviceuser.services"
 }

resource "google_project" var.project_id {
  name       = var.project
  project_id = var.project_id
  org_id     = var.org_id
}


module "project-config-folder" {
  source  = "terraform-google-modules/folders/google//examples/simple_example"
  version = "3.1.0"

  parent  = "organization${var.org_id}"
  names = [ "policies" ]
}

module "org-policy_skip_default_network" {
  source  = "terraform-google-modules/org-policy/google//modules/skip_default_network"
  version = "5.1.0"

  organization_id   = var.org_id
  project_id = var.project_id
  folder_id = module.project_config_folder.folder_id
  policy_for = "organization"
}

output "final_proj_id" {
  value = google_project.
}
