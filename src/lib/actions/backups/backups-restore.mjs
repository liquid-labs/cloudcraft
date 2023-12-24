import { selectBackups } from './lib/select-backups'

const backupsRestore = async({ backupFile, target }) => {
  const backupFiles = backupFile === undefined ? undefined : [backupFile]
  // will always be an array of one
  const backupEntries = await selectBackups({ backupFiles, multiValue : false })

  console.log('backupEntries:', backupEntries, 'target:', target)
}

export { backupsRestore }
