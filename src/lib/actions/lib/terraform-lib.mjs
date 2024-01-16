import * as fsPath from 'node:path'
import * as fs from 'node:fs/promises'

import { find } from 'find-plus'

import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from './constants'

const varFileName = 'terraform.tfvars.json'

const deployTerraform = async({ plan = false } = {}) => {
  await tryExecAsync(`cd '${BUILD_DIR}' && terraform init`, { silent : false })
  const applyCommand = `cd '${BUILD_DIR}' && terraform `
    + (plan === true ? 'plan' : 'apply -auto-approve')
    + ` -var-file="${varFileName}" `

  await tryExecAsync(applyCommand, { noThrow : true, silent : false })
}

const destroyTerraform = async({ plan = false } = {}) => {
  const command = `cd '${BUILD_DIR}' && terraform `
    + (plan === true ? 'plan -destroy' : 'destroy -auto-approve')
    + ` -var-file="${varFileName}" `
  await tryExecAsync(command, { noThrow : true, silent : false })
}

const getProjectData = async() => {
  const jsonContent = (await tryExecAsync(`cd '${BUILD_DIR}' && terraform output -json`)).stdout
  const data = mapTerraformValues(JSON.parse(jsonContent))

  return data
}

const getServerData = async(name) => {
  const serversData = await getServersData()

  return serversData[name]
}

const getServersData = async() => {
  const data = await getProjectData()
  const serversData = data.servers

  return serversData
}

const stageTerraformFiles = async() => {
  const terraformSrcPath = fsPath.join(__dirname, 'terraform')
  const sourceFiles = await find({ root : terraformSrcPath, tests : [({ name }) => name.endsWith('.tf')] })

  for (const sourceFile of sourceFiles) {
    const builtFile = sourceFile
      .replace(new RegExp('.+' + fsPath.sep + 'terraform'), BUILD_DIR)

    await fs.mkdir(fsPath.dirname(builtFile), { recursive : true })

    await fs.cp(sourceFile, builtFile)
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

const mapTerraformValues = (data, result = {}) => {
  for (const key of Object.keys(data)) {
    result[key] = data[key].value
  }

  return result
}

export {
  deployTerraform,
  destroyTerraform,
  getProjectData,
  getServerData,
  getServersData,
  stageTerraformFiles,
  stageTerraformVars
}
