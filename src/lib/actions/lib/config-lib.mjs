import * as fsPath from 'node:path'
import * as fs from 'node:fs/promises'

import yaml from 'js-yaml'

import { CONFIG_DIR } from './constants'

const configPath = fsPath.join(CONFIG_DIR, 'cloudcraft-config.yaml')

const getConfig = async() => {
  try {
    const configContents = await fs.readFile(configPath, { encoding : 'utf8' })
    const config = yaml.load(configContents)

    return config
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      return {}
    }
    else {
      throw e
    }
  }
}

const saveConfig = async(config) => {
  await fs.mkdir(CONFIG_DIR, { recursive : true })

  const configContents = yaml.dump(config)
  await fs.writeFile(configPath, configContents)
}

export { getConfig, saveConfig }
