import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { info } from '../../lib/actions'

const handleInfo = async({ argv }) => {
  const infoOptionsSpec = cliSpec.commands.find(({ name }) => name === 'info').arguments
  const infoOptions = commandLineArgs(infoOptionsSpec, { argv })
  const { name, refresh } = infoOptions

  const selectFields = []
  if (infoOptions['ip-address'] === true) {
    selectFields.push('ip_address')
  }
  if (infoOptions['machine-type'] === true) {
    selectFields.push('machine_type')
  }

  await info({ name, refresh, selectFields })
}

export { handleInfo }
