import { getConfig, saveConfig } from './lib/config-lib'
import { selectBucket } from './lib/select-bucket'
import { selectOrg } from './lib/select-org'
import { selectProject } from './lib/select-project'
import { stageTerraform } from './lib/terraform-lib'

async function start() {
  const config = await getConfig()

  const { organizationDisplayName, organizationName } = await selectOrg({ config }) || {}
  const { projectDisplayName, projectId, projectName } = await selectProject({ config, organizationName })
  const bucketName = await selectBucket({ config, projectId })

  await saveConfig(config)

  stageTerraform()

  console.log(organizationDisplayName, organizationName)
  console.log(projectDisplayName, projectName)
  console.log(bucketName)
}

start()
