import { getConfig, saveConfig } from './lib/config-lib'
import { selectBillingAccount } from './lib/select-billing-account'
// import { selectBucket } from './lib/select-bucket'
import { selectOrg } from './lib/select-org'
// import { selectProject } from './lib/select-project'
import { deployTerraform, stageTerraformFiles, stageTerraformVars } from './lib/terraform-lib'

const create = async({
  name = throw new Error("Must define 'name' when creating a server."),
  cloudcraftServerMemory,
  computeDiskSize,
  hostImage,
  machineType,
  serverType
}) => {
  const config = await getConfig()

  // updates config.organizationName
  await selectOrg({ config })
  // const { projectId, projectName } = await selectProject({ config, organizationName })
  // updates config.billingAccountName
  await selectBillingAccount({ config })
  // const bucketName = await selectBucket({ config, projectId })

  const servers = config.servers || {}
  if (name in servers) {
    throw new Error(`Server '${name}' already exists. You must destroy or update the server.`)
  }

  const ipPrefix = '10.2.'
  let ipTuple3 = 0
  let ipTuple4 = 10
  const serverData = Object.values(servers)
  let ipGuess = ipPrefix + ipTuple3 + '.' + ipTuple4
  while (serverData.some(({ internal_ip }) => internal_ip === ipGuess)) { // eslint-disable-line camelcase
    if (ipTuple4 === 255) {
      ipTuple4 = 0
      ipTuple3 += 1
      if (ipTuple3 > 255) {
        throw new Error('Could not find an available IP address on the internal network. Try deleting an existing server.')
      }
    }
    else {
      ipTuple4 += 1
    }
    ipGuess = ipPrefix + ipTuple3 + '.' + ipTuple4
  }
  const internalIP = ipGuess

  servers[name] = {
    cloudcraft_server_memory : cloudcraftServerMemory,
    computer_disk_size       : computeDiskSize,
    host_image               : hostImage,
    internal_ip              : internalIP,
    machine_type             : machineType,
    server_type              : serverType
  }

  config.servers = servers

  await Promise.all([
    saveConfig(config),
    stageTerraformFiles(),
    stageTerraformVars(config)
  ])

  await deployTerraform()
}

export { create }
