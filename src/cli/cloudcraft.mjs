import commandLineArgs from 'command-line-args'

import { mainOptionsDef } from './lib/constants'
import { handleCreate } from './lib/handle-create'
import { handleHelp } from './lib/handle-help'
import { handleInfo } from './lib/handle-info'

const cloudcraft = async() => {
  const mainOptions = commandLineArgs(mainOptionsDef, { stopAtFirstUnknown : true })
  const argv = mainOptions._unknown || []

  const { command } = mainOptions

  try {
    switch (command) {
    case 'create':
      handleCreate({ argv }); break
    case 'help':
    case undefined:
      handleHelp({ argv }); break
    case 'info':
      handleInfo({ argv }); break
    default:
      process.stderr.write('Uknown command: ' + command + '\n\n')
      handleHelp()
    }
  }
  catch (e) {
    process.stderr.write(e.message + '\n')
    process.exit(2)
  }
}

export { cloudcraft }
