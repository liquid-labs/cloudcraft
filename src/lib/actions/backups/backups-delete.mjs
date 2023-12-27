import * as fs from 'node:fs/promises'

const backupsDelete = async({ backupEntries }) => {
  process.stdout.write(`Deleting ${backupEntries.length} backup files...\n`)

  const rmOps = backupEntries.map(({ filePath }) => fs.rm(filePath))
  await Promise.all(rmOps)

  process.stdout.write('Deletion complete.\n')
}

export { backupsDelete }
