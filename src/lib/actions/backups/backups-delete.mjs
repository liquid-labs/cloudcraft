import * as fs from 'node:fs/promises'

import { selectBackups } from './lib/select-backups'

const backupsDelete = async({ backupFiles }) => {
  const backupEntries = await selectBackups({ backupFiles, multiValue : true })

  process.stdout.write(`Deleting ${backupEntries.length} backup files...\n`)

  const rmOps = backupEntries.map(({ filePath }) => fs.rm(filePath))
  await Promise.all(rmOps)

  process.stdout.write('Deletion complete.\n')
}

export { backupsDelete }
