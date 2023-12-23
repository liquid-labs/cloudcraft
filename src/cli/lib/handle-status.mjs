import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { status } from '../../lib/actions'

const handleStatus = async({ argv }) => {
  const statusOptionsSpec = cliSpec.commands.find(({ name }) => name === 'status').arguments
  const statusOptions = commandLineArgs(statusOptionsSpec, { argv })
  const name = statusOptions['server-name']
  const noPing = statusOptions['no-ping']
  const { refresh } = statusOptions

  await status({ name, noPing, refresh })
}

export { handleStatus }
