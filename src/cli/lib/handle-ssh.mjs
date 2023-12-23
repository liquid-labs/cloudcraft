import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { ssh } from '../../lib/actions'

const handleSSH = async({ argv }) => {
  const sshOptionsSpec = cliSpec.commands.find(({ name }) => name === 'ssh').arguments
  const sshOptions = commandLineArgs(sshOptionsSpec, { argv })
  const name = sshOptions['server-name']
  const evalMode = sshOptions['eval-mode']
  const { command } = sshOptions

  await ssh({ command, evalMode, name })
}

export { handleSSH }
