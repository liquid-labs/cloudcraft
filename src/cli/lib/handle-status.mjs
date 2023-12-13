import commandLineArgs from 'command-line-args'

import { statusOptionsDef } from './constants'
import { status } from '../../lib/actions'

const handleStatus = async({ argv }) => {
  const statusOptions = commandLineArgs(statusOptionsDef, { argv })
  const { name } = statusOptions
  const noPing = statusOptions['no-ping']

  await status({ name, noPing })
}

export { handleStatus }
