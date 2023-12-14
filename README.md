# CloudCraft: Minecraft Cloud Server
__by Liquid Labs__

A robust Google Cloud minecraft server.

## Install

1. [Install terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) if not installed (check with `terraform --version`).
2. [Install gcloud CLI](https://cloud.google.com/sdk/docs/install) if not installed (check with `gcloud --version`).
3. Install CloudCraft:
   ```bash
   npm i -g cloudcraft
   ```

## Usage

1. Authenticate to gcloud:
   ```bash
   gcloud auth application-default login
   ```
2. Create and start a server:
   ```bash
   cloudcraft server create -- name='smith-Family' start
   ```
3. 

_*Untested*_
```bash
npm i liquid-labs/cloudcraft
make deploy
```

_*Prerequisites:*_
- `terraform` cli
- `gcloud` cli
- user has authenticated to the target account where the cloudcraft project will be created

## Features

- Terraform spec uses YAML (which the `make` converts to JSON prior to usage).
- Minecraft service is self-healing (i.e., will restart if it dies using systemd).

## Status

Proof of concept complete.

Next: separate data and runtime; make boot disk entirely ephemeral and use persistent disk for minecraft data only.

See [Minecraft Implementation Diary](https://docs.google.com/document/d/1k8WT486i0k_5MLPrGlIw9xyIHZHS5ZD2kzEFAFv7W_o/edit#) for additional info.

## Command reference

### Usage

`cloudcraft <options> <command>`

### Command summary

- [`create`](#cloudcraft-create): Creates (sets up) a cloud-based Minecraft server managed by Cloudcraft.
- [`help`](#cloudcraft-help): With no command specified, prints a list of available commands or, when a command is specified, prints help for the specified command.
- [`info`](#cloudcraft-info): Prints info about the Minecraft server(s).
- [`list`](#cloudcraft-list): Lists Cloudcraft managed Minecraft servers.
- [`status`](#cloudcraft-status): Displays the status of a Minecraft server.

### Main options

|Option|Description|
|------|------|
|`--throw-error`|In the case of an exception, the default is to print the message. When --throw-error is set, the exception is left uncaught.|

### Command Reference

#### `cloudcraft create <options> [server-name]`

Creates a server named {underline server-name}. This is, by default, a 'bedrock' server.

##### `create` options

|Option|Description|
|------|------|
|`--server-type`|May be one of: bedrock, java|

#### `cloudcraft help <command>`

With no command specified, prints a list of available commands or, when a command is specified, prints help for the specified command.

#### `cloudcraft info <options> <server-name>`

Displays info about the servers or, if {underline name} supplied, a server. By default will display all information. If one or more info select options is provided, then it will only display that information.

##### `info` options

|Option|Description|
|------|------|
|`--ip-address`|Select the public IP address for display.|
|`--machine-type`|Select the machine type for display.|
|`--refresh`|Updates underlying terraform files and applies the results before reading the output.|

#### `cloudcraft list`

Lists Cloudcraft managed Minecraft servers.

#### `cloudcraft status <options> <server-name>`

Tries to determine the if the server is up, it's ping status, and disk usage.

##### `status` options

|Option|Description|
|------|------|
|`--no-ping`|Skips the ping test when set.|



