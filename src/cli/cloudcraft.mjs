import commandLineArgs from 'command-line-args'

import { cliSpec } from './lib/constants'
import { handleCreate } from './lib/handle-create'
import { handleHelp } from './lib/handle-help'
import { handleInfo } from './lib/handle-info'
import { handleList } from './lib/handle-list'
import { handleStatus } from './lib/handle-status'

import { commandLineDocumentation } from 'command-line-documentation'

const cloudcraft = async() => {
  const mainOptions = commandLineArgs(cliSpec.mainOptions, { stopAtFirstUnknown : true })
  const argv = mainOptions._unknown || []

  const { command } = mainOptions
  const throwError = mainOptions['throw-error']

  try {
    switch (command) {
    case 'create':
      handleCreate({ argv }); break
    case 'document':
      console.log(commandLineDocumentation({ cliSpec, mainCommand: 'cloudcraft', sectionDepth: 2, title: 'Command reference' }))
      break
    case 'help':
    case undefined:
      handleHelp({ argv }); break
    case 'info':
      handleInfo({ argv }); break
    case 'list':
      handleList({ argv }); break
    case 'status':
      handleStatus({ argv }); break
    default:
      process.stderr.write('Uknown command: ' + command + '\n\n')
      handleHelp()
    }
  }
  catch (e) {
    if (throwError === true) {
      throw e
    }
    else {
      process.stderr.write(e.message + '\n')
      process.exit(2)
    }
  }
}

export { cloudcraft }
