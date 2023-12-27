import commandLineArgs from 'command-line-args'

import { confirmAction } from './confirm-action'
import { cliSpec } from './constants'
import { destroy } from '../../lib/actions/destroy'

const handleDestroy = async({ argv }) => {
  const destroyOptionsSpec = cliSpec.commands.find(({ name }) => name === 'destroy').arguments
  const destroyOptions = commandLineArgs(destroyOptionsSpec, { argv })
  const name = destroyOptions['server-name']
  const { confirm } = destroyOptions

  await confirmAction({
    actionDescription : `delete server ${name}`,
    confirm
  })

  await destroy({ name })
}

export { handleDestroy }
