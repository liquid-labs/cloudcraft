import * as fsPath from 'node:path'
import * as fs from 'node:fs/promises'

import yaml from 'js-yaml'

import { CONFIG_DIR } from './constants'

const buildDir = fsPath.join(CONFIG_DIR, 'build')

const stageTerraform = async () => {
  const buildDirPromise = fs.mkdir(buildDir, { recursive: true })
  
  const cloudcraftTerraformYAMLPath = fsPath.join(__dirname, 'cloudcraft.tf.yaml')
  const cloudcraftTerraformYAMLContents = await fs.readFile(cloudcraftTerraformYAMLPath)
  const cloudcraftTerraform = yaml.load(cloudcraftTerraformYAMLContents)

  const terraformMainPath = fsPath.join(buildDir, 'main.tf.json')
  const terraformMain = JSON.stringify(cloudcraftTerraform, null, '  ')

  await buildDirPromise
  await fs.writeFile(terraformMainPath, terraformMain)
}

export { stageTerraform }