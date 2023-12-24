import * as fs from 'node:fs/promises'
import * as fsPath from 'node:path'

import { Questioner } from '@liquid-labs/question-and-answer'

import { BACKUP_DIR } from '../../constants'

const backupsDelete = async({ backupFiles }) => {
  const backupEntries = await selectBackups({ multiValue: true })

  process.stdout.write(`Deleting ${backupFiles.length} backup files...\n`)

  const rmOps = backupFiles.map((filePath) => fs.rm(filePath))
  await Promise.all(rmOps)

  process.stdout.write('Deletion complete.\n')
}

export { backupsDelete }