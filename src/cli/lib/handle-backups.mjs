import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { backup } from '../../lib/actions'

const handleBackups = async({ argv }) => {
  const backupOptionsSpec = cliSpec.commands.find(({ name }) => name === 'backups').arguments
  const backupOptions = commandLineArgs(backupOptionsSpec, { argv })
  const name = backupOptions['server-name']

  await backup({ name })
}

export { handleBackups }
