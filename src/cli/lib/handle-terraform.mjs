import commandLineArgs from 'command-line-args'
import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from '../../lib/actions/lib/constants'

import { cliSpec } from './constants'

const handleTerraform = async({ argv }) => {
  const command = 'terraform ' + argv.join(' ')
  await tryExecAsync(`cd '${BUILD_DIR}' && ${command}`, { silent: false })
}

export { handleTerraform }
