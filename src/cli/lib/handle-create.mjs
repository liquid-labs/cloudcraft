import commandLineArgs from 'command-line-args'

import { createOptionsDef, VALID_SERVER_TYPES } from './constants'
// import { handleHelp } from './handle-help'
import { create } from '../../lib/actions'

const handleCreate = async({ argv }) => {
  const createOptions = commandLineArgs(createOptionsDef, { argv })
  const serverType = createOptions['server-type'] // default set in 'create' if undefined

  /* if (name === undefined) {
    process.stderr.write(`Missing required 'name' in create command.\n\n`)
    handleHelp({ argv: ['create'] })
    process.exit(1)
  } */
  if (serverType !== undefined && !VALID_SERVER_TYPES.includes(serverType)) {
    process.stderr.write(`Invalid server type '${serverType}'; must be one of: ${VALID_SERVER_TYPES.join(', ')}\n`)
    process.exit(1)
  }

  await create({ serverType })
}

export { handleCreate }