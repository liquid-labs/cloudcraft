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
## Command reference

### Usage

`cloudcraft <options> <command>`

### Main options

|Option|Description|
|------|------|
|`<command>`|(_main argument_,_optional_) The command to run or a sub-command group.|
|`--quiet`, `-q`|Makes informational output less chatty.|
|`--throw-error`|In the case of an exception, the default is to print the message. When --throw-error is set, the exception is left uncaught.|

### Commands

- [`backups`](#cloudcraft-backups): Selects backup commands.
- [`create`](#cloudcraft-create): Creates a Minecraft named {underline server-name}..
- [`destroy`](#cloudcraft-destroy): Destroys the named server or all resources.
- [`help`](#cloudcraft-help): With no command specified, prints a list of available commands or, when a command is specified, prints help for the specified command.
- [`info`](#cloudcraft-info): Prints info about the Minecraft server(s).
- [`list`](#cloudcraft-list): Lists Cloudcraft managed Minecraft servers.
- [`ssh`](#cloudcraft-ssh): Displays the proper SSH command or executes specified command on remote server.
- [`start`](#cloudcraft-start): Starts the named Minecraft server.
- [`status`](#cloudcraft-status): Displays the status of a Minecraft server.
- [`stop`](#cloudcraft-stop): Stops the named Minecraft server.
- [`terraform`](#cloudcraft-terraform): Runs the terraform command, as specified, in the staged Cloudcraft terraform directory. This command is meant primarily for developers.

<span id="cloudcraft-backups"></span>
#### `cloudcraft backups [command]`

Selects backup commands.

##### `backups` options

|Option|Description|
|------|------|
|`[command]`|(_main argument_,_required_) The backup action to perform.|


##### Subcommands

- [`create`](#cloudcraft-backups-create): Backs up the named server.
- [`delete`](#cloudcraft-backups-delete): Deletes the named or chosen backups.
- [`list`](#cloudcraft-backups-list): Lists the current backups.
- [`restore`](#cloudcraft-backups-restore): Restores the named or chosen backup.

<span id="cloudcraft-backups-create"></span>
###### `cloudcraft backups create [server-name]`

Zips the remote server files and copies them to the cloudcraft data directory.

___`create` options___

|Option|Description|
|------|------|
|`[server-name]`|(_main argument_,_required_) Name of the server to backup.|

<span id="cloudcraft-backups-delete"></span>
###### `cloudcraft backups delete <options> <backup-files>`

Deletes the specified backup file(s) or, if none specified, asks the user to choose one or more files for deletion.

___`delete` options___

|Option|Description|
|------|------|
|`<backup-files>`|(_main argument_,_optional_) The backup file(s) to delete.|
|`--confirm`|If set, then the 'yes/no' confirmation will be skipped.|

<span id="cloudcraft-backups-list"></span>
###### `cloudcraft backups list <options>`

Lists the current backups.

___`list` options___

|Option|Description|
|------|------|
|`--format`|Specifies the format of the output. Can be 'terminal' (default), 'json', or 'yaml'.|

<span id="cloudcraft-backups-restore"></span>
###### `cloudcraft backups restore <options> <backup-file>`

Restores the specified backup or, if none specified, asks the user to choose a backup to restore. By default, the backup will be restored to the server from which it originated. This can be changed with the '--target' option.

___`restore` options___

|Option|Description|
|------|------|
|`<backup-file>`|(_main argument_,_optional_) The backup file to restore.|
|`--confirm`|If set, then the 'yes/no' confirmation will be skipped.|
|`--target`|The server to restore the backup to.|

<span id="cloudcraft-create"></span>
#### `cloudcraft create <options> [server-name]`

Creates a Cloudcraf managed minecraft server named _server-name_. By default this is a bedrock server.

##### `create` options

|Option|Description|
|------|------|
|`[server-name]`|(_main argument_,_required_) The name of the server to create.|
|`--server-type`|May be one of: bedrock, java.|

<span id="cloudcraft-destroy"></span>
#### `cloudcraft destroy <options> <server-name>`

Destroys the named server or all resources.

##### `destroy` options

|Option|Description|
|------|------|
|`<server-name>`|(_main argument_,_optional_) The name of the server to destroy.|
|`--all`|If true, then destroys all infrastructure. Incompatible with '--server-name'.|
|`--confirm`|If set, then the 'yes/no' confirmation will be skipped.|
|`--plan`|Prints the destroy plan without actually doing anything.|

<span id="cloudcraft-help"></span>
#### `cloudcraft help <command>`

With no command specified, prints a list of available commands or, when a command is specified, prints help for the specified command.

##### `help` options

|Option|Description|
|------|------|
|`<command>`|(_main argument_,_optional_) The command to print help for.|

<span id="cloudcraft-info"></span>
#### `cloudcraft info <options> <server-name>`

Displays info about the servers or, if _name_ supplied, a server. By default will display all information. If one or more info select options is provided, then it will only display that information.

##### `info` options

|Option|Description|
|------|------|
|`<server-name>`|(_main argument_,_optional_) The name of the server to get into on.|
|`--select-fields`|List a field to display. Common options include: project-id, ip-address, machine-type, server-memory, and server-type. Underscores and hyphens are interchangeable. May be specified multiple times to select multiple fierds.|
|`--refresh`|Updates underlying terraform files and applies the results before reading the output.|

<span id="cloudcraft-list"></span>
#### `cloudcraft list`

Lists Cloudcraft managed Minecraft servers. When the (primary) option '--quiet' is 'true', then it will output nothing if there are no servers. Otherwise, it prints a human readable message.

<span id="cloudcraft-ssh"></span>
#### `cloudcraft ssh <options> [server-name]`

The 'ssh' command, with no options, is used to generate and display the SSH command you would use to log into the specified server. With '--eval-mode', you can do:
```
eval $(cloudcraft ssh --eval-mode some-sever
```
You can also use the `--command` option to execute a single command.


##### `ssh` options

|Option|Description|
|------|------|
|`[server-name]`|(_main argument_,_required_) The name of the server to log into.|
|`--command`|Will run the specified command and exit.|
|`--eval-mode`|Produces output suitable to 'eval $(cloudcraft ssh a-server)'.|

<span id="cloudcraft-start"></span>
#### `cloudcraft start <options> [server-name]`

Starts the named Minecraft server.

##### `start` options

|Option|Description|
|------|------|
|`[server-name]`|(_main argument_,_required_) The name of the server to start.|
|`--refresh`|Updates and applies the terraform configuration before starting the server.|

<span id="cloudcraft-status"></span>
#### `cloudcraft status <options> [server-name]`

Tries to determine the if the server is up, it's ping status, and disk usage.

##### `status` options

|Option|Description|
|------|------|
|`[server-name]`|(_main argument_,_required_) The name of the server to describe.|
|`--no-ping`|Skips the ping test when set.|
|`--refresh`|Updates and applies the terraform configuration before resolving the server status.|

<span id="cloudcraft-stop"></span>
#### `cloudcraft stop <options> [server-name]`

Stops the named Minecraft server.

##### `stop` options

|Option|Description|
|------|------|
|`[server-name]`|(_main argument_,_required_) The name of the server to stop.|
|`--refresh`|Updates and applies the terraform configuration before stoping the server.|

<span id="cloudcraft-terraform"></span>
#### `cloudcraft terraform`

The entire command (everything after 'cloudcraft') is executed from the Cloudcraft terraform staging directory. E.g., 'cloudcraft terraform plan -no-color' executes 'terraform plan -no-color'.



