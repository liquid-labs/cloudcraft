import { getConfig, saveConfig } from './lib/config-lib'
import { selectBillingAccount } from './lib/select-billing-account'
// import { selectBucket } from './lib/select-bucket'
import { selectOrg } from './lib/select-org'
import { selectProject } from './lib/select-project'
import { deployTerraform, stageTerraformMain, stageTerraformVars } from './lib/terraform-lib'

const create = async({ serverType }) => {
  const config = await getConfig()
  if (!(config.serverType === serverType || config.serverType === undefined && serverType === 'bedrock')) {
    const currType = (config.serverType && `'${config.serverType}'`) || "'bedrock' (default)"
    throw new Error(`Cannot change server type from ${currType} to '${serverType}'. 'destroy' and re-create server or create new server in another project.`)
  }
  if (serverType !== undefined) {
    config.serverType = serverType
  }

  const { organizationName } = await selectOrg({ config }) || {}
  // const { projectId, projectName } = await selectProject({ config, organizationName })
  const { billingAccountName } = await selectBillingAccount({ config })
  // const bucketName = await selectBucket({ config, projectId })

  await Promise.all([
    saveConfig(config),
    stageTerraformMain(),
    stageTerraformVars({ billingAccountName, organizationName/*, projectId */, serverType })
  ])

  await deployTerraform()
}

export { create }