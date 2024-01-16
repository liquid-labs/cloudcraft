import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { info } from '../../lib/actions'

const handleInfo = async({ argv }) => {
  const infoOptionsSpec = cliSpec.commands.find(({ name }) => name === 'info').arguments
  const infoOptions = commandLineArgs(infoOptionsSpec, { argv })
  const serverName = infoOptions['server-name']
  const { refresh } = infoOptions

  const selectFields = infoOptions['select-fields']?.map((v) => v.replaceAll(/-/g, '_'))

  await info({ serverName, refresh, selectFields })
}

export { handleInfo }
