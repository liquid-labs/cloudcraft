import commandLineArgs from 'command-line-args'

import { cliSpec } from './lib/constants'
import { handleBackups } from './lib/handle-backups'
import { handleCreate } from './lib/handle-create'
import { handleDestroy } from './lib/handle-destroy'
import { handleHelp } from './lib/handle-help'
import { handleInfo } from './lib/handle-info'
import { handleList } from './lib/handle-list'
import { handleSSH } from './lib/handle-ssh'
import { handleStart } from './lib/handle-start'
import { handleStatus } from './lib/handle-status'
import { handleStop } from './lib/handle-stop'
import { handleTerraform } from './lib/handle-terraform'

import { commandLineDocumentation } from 'command-line-documentation'

const cloudcraft = async() => {
  const mainOptions = commandLineArgs(cliSpec.mainOptions, { stopAtFirstUnknown : true })
  const argv = mainOptions._unknown || []

  const { command } = mainOptions
  const throwError = mainOptions['throw-error']

  try {
    switch (command) {
    case 'backups':
      handleBackups({ argv }); break
    case 'create':
      handleCreate({ argv }); break
    case 'destroy':
      handleDestroy({ argv }); break
    case 'document':
      console.log(commandLineDocumentation(cliSpec, { sectionDepth : 2, title : 'Command reference' }))
      break
    case 'help':
    case undefined:
      handleHelp({ argv }); break
    case 'info':
      handleInfo({ argv }); break
    case 'list':
      handleList({ argv }); break
    case 'ssh':
      handleSSH({ argv }); break
    case 'start':
      handleStart({ argv }); break
    case 'status':
      handleStatus({ argv }); break
    case 'stop':
      handleStop({ argv }); break
    case 'terraform':
      handleTerraform({ argv }); break
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
