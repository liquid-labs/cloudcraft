# Cloudcraft: Minecraft Cloud Server
__by Liquid Labs__

A robust Minecraft server management tool using Google Cloud. Cloudcraft will set up, backup, start, stop, and destroy cloud based Minecraft servers.

___Status note___: This has been manually tested relatively thouroughly and, at the same time, everything is spretty new.

## Install

1. [Install terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) if not installed (check with `terraform --version`).
2. [Install gcloud CLI](https://cloud.google.com/sdk/docs/install) if not installed (check with `gcloud --version`).
3. Install Cloudcraft:
   ```bash
   npm i -g cloudcraft
   ```

## Usage

```bash
gcloud auth application-default login # authenticate to gcloud, if necessary
# start and run a new Minecraft server
cloudcraft server create -- name='my-mc-server' start
```

## Costs

You will have to (potentially) pay for a few thins. Overall, costs (for a 24x7 server) are comparible to the monthly cost of a premium Minecraft hosting service with similar RAM capacity.

1. Your disk storage, which is pretty cheap.
2. The time your server is running. This is probably the most expensive thing and stopping the server when not in use can save you a lot of money.
3. Data ingress and egress. At the time of writing, there was a significant amount of free data transfer per month, but a larger, 24x7 server would probably start to incur some costs for data transfer as well.

## References

- Terraform [main](./src/terraform/README.md) and [vm-instance module](./src/terraform/modules/vm-instance/README.md) documentation.
