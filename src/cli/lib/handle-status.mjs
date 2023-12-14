import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { status } from '../../lib/actions'

const handleStatus = async({ argv }) => {
  const statusOptionsSpec = cliSpec.commands.find(({ name }) => name === 'status').arguments
  const statusOptions = commandLineArgs(statusOptionsDef, { argv })
  const { name } = statusOptions
  const noPing = statusOptions['no-ping']

  await status({ name, noPing })
}

export { handleStatus }
