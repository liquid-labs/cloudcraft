import { confirmAction } from './lib/confirm-action'
import { selectBackups } from './lib/select-backups'

const backupsRestore = async({ backupFile, confirm, target }) => {
  const backupFiles = backupFile === undefined ? undefined : [backupFile]
  // will always be an array of one
  const backupEntries = await selectBackups({ backupFiles, multiValue : false })
  if (backupEntries.length !== 1) {
    throw new Error(`Unexpected number of backups (${backupEntries.length}) selected for restoration. Must select exactly one.`)
  }
  const backupEntry = backupEntries[0]

  if (target === undefined) {
    target = backupEntry.serverName
  }

  await confirmAction({ actionDescription: 'restore backup file ' + backupEntry.fileName, confirm })

  console.log('backupEntry:', backupEntry, 'target:', target)
}

export { backupsRestore }
