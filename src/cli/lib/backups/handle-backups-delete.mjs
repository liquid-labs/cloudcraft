import commandLineArgs from 'command-line-args'

import { selectBackups } from './select-backups'
import { confirmAction } from '../confirm-action'
import { backupsDelete } from '../../../lib/actions'

const handleBackupsDelete = async({ argv, backupsCLISpec }) => {
  const deleteOptionsSpec = backupsCLISpec.commands.find(({ name }) => name === 'delete').arguments
  const deleteOptions = commandLineArgs(deleteOptionsSpec, { argv })
  const backupFiles = deleteOptions['backup-files']
  const { confirm } = deleteOptions

  const backupEntries = await selectBackups({ backupFiles, multiValue : true })

  await confirmAction({
    actionDescription : `delete backup file${backupEntries.length > 1 ? 's' : ''} `
      + backupEntries.map(({ fileName }) => fileName).join(', '),
    confirm
  })

  await backupsDelete({ backupEntries })
}

export { handleBackupsDelete }
