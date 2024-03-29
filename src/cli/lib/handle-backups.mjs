import commandLineArgs from 'command-line-args'

import { cliSpec } from './constants'
import { handleBackupsCreate } from './backups/handle-backups-create'
import { handleBackupsDelete } from './backups/handle-backups-delete'
import { handleBackupsList } from './backups/handle-backups-list'
import { handleBackupsRestore } from './backups/handle-backups-restore'

const handleBackups = async({ argv }) => {
  const backupsCLISpec = cliSpec.commands.find(({ name }) => name === 'backups')
  const backupOptionsSpec = backupsCLISpec.arguments
  const backupOptions = commandLineArgs(backupOptionsSpec, { argv, stopAtFirstUnknown : true })
  const { command } = backupOptions
  argv = backupOptions._unknown || []

  switch (command) {
  case 'create':
    handleBackupsCreate({ argv, backupsCLISpec }); break
  case 'delete':
    handleBackupsDelete({ argv, backupsCLISpec }); break
  case 'list':
    handleBackupsList({ argv, backupsCLISpec }); break
  case 'restore':
    handleBackupsRestore({ argv, backupsCLISpec }); break
  default:
    throw new Error('Unknown backup command: ' + command)
  }
}

export { handleBackups }
