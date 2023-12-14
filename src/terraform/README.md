# Cloudcraft Terraform Reference : root module

This root module creates a Google Project and shared network resources. Machine instances and their accompanying disks and IP addresses are generated in the [vm-instance module](./modules/vm-instance/README.md)

![Cloudcraft environment diagrame](./cloudcraft-environment-diagram.png)

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_google"></a> [google](#requirement\_google) | >= 4.27.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_google"></a> [google](#provider\_google) | 5.8.0 |
| <a name="provider_random"></a> [random](#provider\_random) | 3.6.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_vm_instance"></a> [vm\_instance](./modules/vm-instance/README.md) | ./modules/vm-instance | n/a |

## Resources

| Name | Type |
|------|------|
| [google_compute_firewall.cloudcraft_service](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_firewall) | resource |
| [google_compute_firewall.ping](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_firewall) | resource |
| [google_compute_firewall.ssh](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_firewall) | resource |
| [google_compute_network.cloudcraft_network](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_network) | resource |
| [google_compute_subnetwork.cloudcraft_subnet](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_subnetwork) | resource |
| [google_project.cloudcraft-project](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project) | resource |
| [google_project_iam_custom_role.cloudcraft_switcher](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_iam_custom_role) | resource |
| [google_project_iam_custom_role.instance_lister](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_iam_custom_role) | resource |
| [google_project_service.compute_api](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_service) | resource |
| [google_service_account.cloudcraft_service_acct](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/service_account) | resource |
| [random_id.project_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_billing_account_id"></a> [billing\_account\_id](#input\_billing\_account\_id) | ID of the billing account to use for the project. | `string` | n/a | yes |
| <a name="input_network_name"></a> [network\_name](#input\_network\_name) | The name of the network the server resides in. | `string` | `"cloudcraft-network"` | no |
| <a name="input_org_id"></a> [org\_id](#input\_org\_id) | The name of hosting organization's ID. | `any` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | The region where to build the project. | `string` | `"us-central1"` | no |
| <a name="input_server_type"></a> [server\_type](#input\_server\_type) | Takes 'java' or 'bedrock'. | `string` | `"bedrock"` | no |
| <a name="input_servers"></a> [servers](#input\_servers) | A map of the server configurations. | <pre>map(<br>  object({<br>    server_memory = optional(string)<br>    data_disk_size = optional(string)<br>    host_image = optional(string)<br>    internal_ip = string<br>    machine_type = optional(string),<br>    server_type = optional(string)<br>  })<br>)</pre> | n/a | yes |
| <a name="input_vm_managers"></a> [vm\_managers](#input\_vm\_managers) | Name of group with permisions to activate and deactivate the server. | `string` | `"cloudcraft-users"` | no |
| <a name="input_zone"></a> [zone](#input\_zone) | The zone where to build the project. | `string` | `"us-central1-c"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_project_id"></a> [project\_id](#output\_project\_id) | The project ID. |
| <a name="output_servers"></a> [servers](#output\_servers) | The information on each of the servers. |
