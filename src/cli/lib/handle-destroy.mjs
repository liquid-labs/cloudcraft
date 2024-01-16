import commandLineArgs from 'command-line-args'

import { confirmAction } from './confirm-action'
import { cliSpec } from './constants'
import { destroy } from '../../lib/actions/destroy'

const handleDestroy = async({ argv }) => {
  const destroyOptionsSpec = cliSpec.commands.find(({ name }) => name === 'destroy').arguments
  const destroyOptions = commandLineArgs(destroyOptionsSpec, { argv })
  const name = destroyOptions['server-name']
  const { all, confirm, plan } = destroyOptions

  if (name !== undefined && all === true) {
    throw new Error("Cannot set both '--all' and '<server name>' in destroy option. Use one mode.")
  }

  if (plan !== true) {
    const actionDescription = all === true ? 'destory project' : `destroy server ${name}`
    await confirmAction({ actionDescription, confirm })
  }

  await destroy({ all, name, plan })
}

export { handleDestroy }
