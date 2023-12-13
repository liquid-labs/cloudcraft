import yaml from 'js-yaml'
import pick from 'lodash/pick'

import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from './lib/constants'

const info = async({ name, selectFields }) => {
  const jsonContent = (await tryExecAsync(`cd '${BUILD_DIR}' && terraform output -json`)).stdout
  const data = JSON.parse(jsonContent)
  const serversData = data.servers.value

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
