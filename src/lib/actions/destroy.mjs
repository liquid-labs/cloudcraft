import { getConfig, saveConfig } from './lib/config-lib'
import { deployTerraform, stageTerraformVars } from './lib/terraform-lib'

const destroy = async({ name }) => {
  process.stdout.write(`Destroying '${name}'...\n`)

  const config = await getConfig()

  delete config.servers[name]

  process.stdout.write('Updating files...')
  await Promise.all([
    saveConfig(config),
    // stageTerraformFiles(),
    stageTerraformVars(config)
  ])

  process.stdout.write('Updating environment...')
  await deployTerraform()
  process.stdout.write(`${name} destroyed.`)
}

export { destroy }
