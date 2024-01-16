<!-- BEGIN_TF_DOCS -->
# Cloudcraft Terraform Reference: vm-instance module

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_google"></a> [google](#requirement\_google) | >= 4.27.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_google"></a> [google](#provider\_google) | >= 4.27.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [google_compute_address.cloudcraft_ip](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_address) | resource |
| [google_compute_disk.cloudcraft_boot_disk](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_disk) | resource |
| [google_compute_disk.cloudcraft_data_disk](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_disk) | resource |
| [google_compute_instance.cloudcraft_host](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_data_disk_size"></a> [data\_disk\_size](#input\_data\_disk\_size) | The size of the base host disk in GB. | `number` | `10` | no |
| <a name="input_host_image"></a> [host\_image](#input\_host\_image) | Reference to base image. | `string` | `"projects/cos-cloud/global/images/cos-109-17800-66-32"` | no |
| <a name="input_internal_ip"></a> [internal\_ip](#input\_internal\_ip) | Where to connect to the internal network. | `any` | n/a | yes |
| <a name="input_machine_type"></a> [machine\_type](#input\_machine\_type) | The instance type to use for the cloudcraft server. | `string` | `"n1-standard-1"` | no |
| <a name="input_name"></a> [name](#input\_name) | Name cloudcraft server instance. | `any` | n/a | yes |
| <a name="input_network"></a> [network](#input\_network) | The network resource where the host resides. | `any` | n/a | yes |
| <a name="input_project_id"></a> [project\_id](#input\_project\_id) | The project ID. | `any` | n/a | yes |
| <a name="input_server_memory"></a> [server\_memory](#input\_server\_memory) | The amount of memory to dedicate to the Docker-based Minecraft server. | `string` | `"6.5G"` | no |
| <a name="input_server_type"></a> [server\_type](#input\_server\_type) | The Minecraft server type to launch. | `string` | `"bedrock"` | no |
| <a name="input_subnet"></a> [subnet](#input\_subnet) | The subnet resource where the host resides. | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_data_disk_size"></a> [data\_disk\_size](#output\_data\_disk\_size) | The size of the base VM root disk, in GB. |
| <a name="output_host_image"></a> [host\_image](#output\_host\_image) | The image to use for the base VM. |
| <a name="output_internal_ip"></a> [internal\_ip](#output\_internal\_ip) | Internal IP address. |
| <a name="output_ip_address"></a> [ip\_address](#output\_ip\_address) | Data on the IP address created for the VM. |
| <a name="output_machine_type"></a> [machine\_type](#output\_machine\_type) | Type of the base VM. |
| <a name="output_server_memory"></a> [server\_memory](#output\_server\_memory) | Memory of the hosted VM / Minecraft server. |
| <a name="output_server_type"></a> [server\_type](#output\_server\_type) | The type of Minecraft server hosted. |
<!-- END_TF_DOCS -->