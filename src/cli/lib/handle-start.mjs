import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { start } from '../../lib/actions'

const handleStart = async({ argv }) => {
  const startOptionsSpec = cliSpec.commands.find(({ name }) => name === 'start').arguments
  const startOptions = commandLineArgs(startOptionsSpec, { argv })
  const name = startOptions['server-name']
  const { refresh } = startOptions

  await start({ name, refresh })
}

export { handleStart }
