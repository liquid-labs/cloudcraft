import commandLineArgs from 'command-line-args'

import { mainOptionsDef } from './lib/constants'
import { handleCreate } from './lib/handle-create'
import { handleHelp } from './lib/handle-help'

const cloudcraft = async() => {
  const mainOptions = commandLineArgs(mainOptionsDef, { stopAtFirstUnknown : true })
  const argv = mainOptions._unknown || []

  const { command } = mainOptions

  switch (command) {
  case 'create':
    handleCreate({ argv }); break
  case 'help':
  case undefined:
    handleHelp({ argv }); break
  default:
    process.stderr.write('Uknown command: ' + command + '\n\n')
    handleHelp()
  }
}

export { cloudcraft }
