import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { stop } from '../../lib/actions'

const handleStop = async({ argv }) => {
  const stopOptionsSpec = cliSpec.commands.find(({ name }) => name === 'stop').arguments
  const stopOptions = commandLineArgs(stopOptionsSpec, { argv })
  const name = stopOptions['server-name']
  const { refresh } = stopOptions

  await stop({ name, refresh })
}

export { handleStop }
