import yaml from 'js-yaml'
import pick from 'lodash/pick'

import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from './lib/constants'
import { deployTerraform, getServersData, stageTerraformFiles } from './lib/terraform-lib'

const info = async({ name, refresh, selectFields }) => {
  if (refresh === true) {
    stageTerraformFiles()
    deployTerraform()
  }

  const serversData = await getServersData()

  if (name !== undefined && selectFields.length === 1) {
    process.stdout.write(serversData[name][selectFields[0]] + '\n')
  }
  else if (name !== undefined) {
    const serverData = serversData[name]
    if (selectFields.length > 0) {
      const selectedData = pick(serverData, selectFields)
      process.stdout.write(yaml.dump(selectedData))
    }
    else {
      process.stdout.write(yaml.dump(serverData))
    }
  }
  else { // no name
    if (selectFields.length > 0) {
      const selectedData = {}
      for (const server of Object.keys(serversData)) {
        selectedData[server] = pick(serversData[server], selectFields)
      }
      process.stdout.write(yaml.dump(selectedData))
    }
    else {
      process.stdout.write(yaml.dump(serversData))
    }
  }
}

export { info }
