import { getConfig, saveConfig } from './lib/config-lib'
import { selectBillingAccount } from './lib/select-billing-account'
// import { selectBucket } from './lib/select-bucket'
import { selectOrg } from './lib/select-org'
import { selectProject } from './lib/select-project'
import { deployTerraform, stageTerraformMain, stageTerraformVars } from './lib/terraform-lib'

async function start() {
  const config = await getConfig()

  const { organizationName } = await selectOrg({ config }) || {}
  // const { projectId, projectName } = await selectProject({ config, organizationName })
  const { billingAccountName } = await selectBillingAccount({ config })
  // const bucketName = await selectBucket({ config, projectId })

  await Promise.all([
    saveConfig(config),
    stageTerraformMain(),
    stageTerraformVars({ billingAccountName, organizationName/*, projectId */})
  ])

  await deployTerraform()
}

start()
