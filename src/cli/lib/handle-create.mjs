import commandLineArgs from 'command-line-args'

import { cliSpec, VALID_SERVER_TYPES } from './constants'
import { handleHelp } from './handle-help'
import { create } from '../../lib/actions'

const handleCreate = async({ argv }) => {
  const createOptionsSpec = cliSpec.commands.find(({ name }) => name === 'create').arguments
  const createOptions = commandLineArgs(createOptionsSpec, { argv })
  const serverName = createOptions['server-name']
  const serverType = createOptions['server-type'] // default set in 'create' if undefined

  if (serverName === undefined) {
    process.stderr.write('Missing required \'server-name\' positional argument in create command.\n\n')
    handleHelp({ argv : ['create'] })
    process.exit(1)
  }
  else if (!serverName.match(/^[a-z][a-z0-9-]*$/)) {
    process.stderr.write(`Invalid server name '${serverName}'. Name musts start with a lowercase letter and consist of lowercase letters, numbers, and dashes (-).`)
    process.exit(1)
  }

  if (serverType !== undefined && !VALID_SERVER_TYPES.includes(serverType)) {
    process.stderr.write(`Invalid server type '${serverType}'; must be one of: ${VALID_SERVER_TYPES.join(', ')}\n`)
    process.exit(1)
  }

  await create({ serverName, serverType })
}

export { handleCreate }
