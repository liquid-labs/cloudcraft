import commandLineArgs from 'command-line-args'

import { backupsList } from '../../../lib/actions'

const handleBackupsList = async({ argv, backupsCLISpec }) => {
  const listOptionsSpec = backupsCLISpec.subCommands.find(({ name }) => name === 'list').arguments
  const listOptions = commandLineArgs(listOptionsSpec, { argv })
  const { format } = listOptions

  await backupsList({ format })
}

export { handleBackupsList }
