import yaml from 'js-yaml'
import pick from 'lodash/pick'

import { deployTerraform, getProjectData, stageTerraformFiles } from './lib/terraform-lib'

const info = async({ serverName, refresh, selectFields = [] }) => {
  if (refresh === true) {
    await stageTerraformFiles()
    await deployTerraform()
  }

  const data = await getProjectData()
  const serversData = data.servers

  if (serverName !== undefined && selectFields.length === 1) {
    if (selectFields[0] === 'project_id') {
      process.stdout.write(data.project_id + '\n')
    }
    else {
      process.stdout.write(serversData[serverName][selectFields[0]] + '\n')
    }
  }
  else if (serverName === undefined && selectFields.length === 1 && selectFields[0] === 'project_id') {
    process.stdout.write(data.project_id + '\n')
  }
  else if (serverName !== undefined) {
    const serverData = serversData[serverName]
    if (selectFields.length > 0) {
      const selectedData = pick(serverData, selectFields)
      if (selectFields.includes('project_id')) {
        selectedData.project_id = data.project_id
      }
      process.stdout.write(yaml.dump(selectedData))
    }
    else {
      process.stdout.write(yaml.dump(serverData))
    }
  }
  else { // no serverName
    if (selectFields.length > 0) {
      const selectedData = {}
      for (const server of Object.keys(serversData)) {
        selectedData[server] = pick(serversData[server], selectFields)
      }
      if (selectFields.includes('project_id')) {
        selectedData.project_id = data.project_id
      }
      process.stdout.write(yaml.dump(selectedData))
    }
    else {
      process.stdout.write(yaml.dump(data))
    }
  }
}

export { info }
