# Minecraft Cloud Server
__by Liquid Labs__

A robust Google Cloud minecraft server.

## Usage

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
