import commandLineArgs from 'command-line-args'

import { selectBackups } from './select-backups'
import { confirmAction } from '../confirm-action'
import { backupsRestore } from '../../../lib/actions'

const handleBackupsRestore = async({ argv, backupsCLISpec }) => {
  const restoreOptionsSpec = backupsCLISpec.commands.find(({ name }) => name === 'restore').arguments
  const restoreOptions = commandLineArgs(restoreOptionsSpec, { argv })
  const backupFile = restoreOptions['backup-file']
  const { confirm } = restoreOptions
  let { target } = restoreOptions

  const backupFiles = backupFile === undefined ? undefined : [backupFile]
  // will always be an array of one
  const backupEntries = await selectBackups({ backupFiles, multiValue : false })
  if (backupEntries.length !== 1) {
    throw new Error(`Unexpected number of backups (${backupEntries.length}) selected for restoration. Must select exactly one.`)
  }
  const backupEntry = backupEntries[0]

  if (target === undefined) {
    target = backupEntry.serverName
    // TODO: verify target is a valid server name
  }

  await confirmAction({ actionDescription : 'restore backup file ' + backupEntry.fileName, confirm })

  await backupsRestore({ backupEntry, target })
}

export { handleBackupsRestore }
