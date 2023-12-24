import * as fs from 'node:fs/promises'

import { confirmAction } from './lib/confirm-action'
import { selectBackups } from './lib/select-backups'

const backupsDelete = async({ backupFiles, confirm }) => {
  const backupEntries = await selectBackups({ backupFiles, multiValue : true })

  await confirmAction({
    actionDescription: `delete backup file${backupEntries.length > 1 ? 's' : ''} ` 
      + backupEntries.map(({ fileName }) => fileName).join(', '),
    confirm,
  })

  process.stdout.write(`Deleting ${backupEntries.length} backup files...\n`)

  const rmOps = backupEntries.map(({ filePath }) => fs.rm(filePath))
  await Promise.all(rmOps)

  process.stdout.write('Deletion complete.\n')
}

export { backupsDelete }
