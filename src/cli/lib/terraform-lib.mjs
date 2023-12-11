import * as fsPath from 'node:path'
import * as fs from 'node:fs/promises'

import yaml from 'js-yaml'

import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { CONFIG_DIR } from './constants'

const buildDir = fsPath.join(CONFIG_DIR, 'build')
const varFileName = 'terraform.tfvars.json'

const deployTerraform = async() => {
  await tryExecAsync(`cd '${buildDir}' && terraform init`, { silent : false })
  await tryExecAsync(
    `cd '${buildDir}' && terraform apply -var-file="${varFileName}" -auto-approve`,
    { noThrow : true, silent : false }
  )
}

const stageTerraformMain = async() => {
  const buildDirPromise = fs.mkdir(buildDir, { recursive : true })

  const cloudcraftTerraformYAMLPath = fsPath.join(__dirname, 'cloudcraft.tf.yaml')
  const cloudcraftTerraformYAMLContents = await fs.readFile(cloudcraftTerraformYAMLPath)
  const cloudcraftTerraform = yaml.load(cloudcraftTerraformYAMLContents)

  const terraformMainPath = fsPath.join(buildDir, 'main.tf.json')
  const terraformMain = JSON.stringify(cloudcraftTerraform, null, '  ')

  await buildDirPromise
  await fs.writeFile(terraformMainPath, terraformMain)
}

const stageTerraformVars = async({ billingAccountName, organizationName/*, projectId */}) => {
  const buildDirPromise = fs.mkdir(buildDir, { recursive : true })

  const orgId = organizationName.slice(14) // remove 'organizations/' from the name
  const billingAccountId = billingAccountName.slice(16)
  console.log('billingAccountName:', billingAccountName) // DEBUG
  console.log('billingAccountId:', billingAccountId) // DEBUG

  const vars = {
    billing_account_id : billingAccountId,
    org_id             : orgId
    // project_id         : projectId
  }

  const varsPath = fsPath.join(buildDir, varFileName)

  const varsContent = JSON.stringify(vars, null, '  ')

  await buildDirPromise
  await fs.writeFile(varsPath, varsContent)
}

export { deployTerraform, stageTerraformMain, stageTerraformVars }
