import commandLineArgs from 'command-line-args'

import { backupsDelete } from '../../../lib/actions'

const handleBackupsDelete = async({ argv, backupsCLISpec }) => {
  const deleteOptionsSpec = backupsCLISpec.commands.find(({ name }) => name === 'delete').arguments
  const deleteOptions = commandLineArgs(deleteOptionsSpec, { argv })
  const backupFiles = deleteOptions['backup-files']
  const { confirm } = deleteOptions

  await backupsDelete({ backupFiles, confirm })
}

export { handleBackupsDelete }
