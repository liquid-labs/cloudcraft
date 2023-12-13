import * as fsPath from 'node:path'
import * as fs from 'node:fs/promises'

import { find } from 'find-plus'
import yaml from 'js-yaml'

import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from './constants'

const varFileName = 'terraform.tfvars.json'

const deployTerraform = async() => {
  await tryExecAsync(`cd '${BUILD_DIR}' && terraform init`, { silent : false })
  await tryExecAsync(
    `cd '${BUILD_DIR}' && terraform apply -var-file="${varFileName}" -auto-approve`,
    { noThrow : true, silent : false }
  )
}

const stageTerraformFiles = async() => {
  const terraformSrcPath = fsPath.join(__dirname, 'terraform')
  const sourceFiles = await find({ root : terraformSrcPath, tests : [({ name }) => name.endsWith('.yaml')] })

  for (const sourceFile of sourceFiles) {
    const builtFile = sourceFile
      .replace(new RegExp('.+' + fsPath.sep + 'terraform'), BUILD_DIR)
      .replace(/\.yaml$/, '.json')

    const buildDirPromise = fs.mkdir(fsPath.dirname(builtFile), { recursive : true })

    const yamlContents = await fs.readFile(sourceFile)
    const data = yaml.load(yamlContents)
    const jsonContents = JSON.stringify(data, null, '  ')

    await buildDirPromise
    await fs.writeFile(builtFile, jsonContents)
  }
}

const stageTerraformVars = async({ billingAccountName, organizationName/*, projectId */, servers }) => {
  const buildDirPromise = fs.mkdir(BUILD_DIR, { recursive : true })

  const orgId = organizationName.slice(14) // remove 'organizations/' from the name
  const billingAccountId = billingAccountName.slice(16)

  const vars = {
    billing_account_id : billingAccountId,
    org_id             : orgId,
    // project_id         : projectId,
    servers
  }

  const varsPath = fsPath.join(BUILD_DIR, varFileName)

  const varsContent = JSON.stringify(vars, null, '  ')

  await buildDirPromise
  await fs.writeFile(varsPath, varsContent)
}

export { deployTerraform, stageTerraformFiles, stageTerraformVars }
