import { getConfig, saveConfig } from './lib/config-lib'
import { deployTerraform, destroyTerraform, stageTerraformVars } from './lib/terraform-lib'

const destroy = async({ all = false, name, plan = false }) => {
  const config = await getConfig()
  if (all === true) {
    await destroyAll({ config, plan })
  }
  else {
    await destroyServer({ config, name, plan })
  }
}

const destroyAll = async({ config, plan }) => {
  const actionDescription = (plan === true ? 'Planning destruction of ' : 'Destroying ')
    + 'cloudcraft project...\n'
  process.stdout.write(actionDescription)
  await destroyTerraform({ plan })
  if (plan !== true) {
    delete config.servers
    await Promise.all([
      saveConfig(config),
      // stageTerraformFiles(),
      stageTerraformVars(config)
    ])
    process.stdout.write('Cloudcraft project destroyed.')
  }
}

const destroyServer = async({ config, name, plan }) => {
  const actionDescription = (plan === true ? 'Planning destruction of ' : 'Destroying ')
    + `'${name}'...\n`
  process.stdout.write(actionDescription)

  const origConfig = structuredClone(config)

  delete config.servers[name]

  process.stdout.write('Updating files...')
  await Promise.all([
    saveConfig(config),
    // stageTerraformFiles(),
    stageTerraformVars(config)
  ])

  process.stdout.write('Updating environment...\n')
  await deployTerraform({ plan })

  if (plan === true) {
    process.stdout.write('Restoring original configuration...\n')
    await Promise.all([
      saveConfig(origConfig),
      // stageTerraformFiles(),
      stageTerraformVars(origConfig)
    ])
    process.stdout.write('done\n')
  }
  else {
    process.stdout.write(`${name} destroyed.\n`)
  }
}

export { destroy }
