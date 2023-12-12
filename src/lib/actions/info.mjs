import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from './lib/constants'

import { getConfig, saveConfig } from './lib/config-lib'
import { selectBillingAccount } from './lib/select-billing-account'
// import { selectBucket } from './lib/select-bucket'
import { selectOrg } from './lib/select-org'
// import { selectProject } from './lib/select-project'
import { deployTerraform, stageTerraformFiles, stageTerraformVars } from './lib/terraform-lib'

const info = async({ name }) => {
  await stageTerraformFiles()

  const jsonContent = (await tryExecAsync(`cd '${BUILD_DIR}' && terraform output -json`)).stdout

  process.stdout.write(jsonContent + '\n')
}

export { info }
