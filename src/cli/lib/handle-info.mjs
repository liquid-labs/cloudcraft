import commandLineArgs from 'command-line-args'

import { infoOptionsDef } from './constants'
import { info } from '../../lib/actions'

const handleInfo = async({ argv }) => {
  const infoOptions = commandLineArgs(infoOptionsDef, { argv })
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
