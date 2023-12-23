import * as fs from 'node:fs/promises'
import * as fsPath from 'node:path'

import { Questioner } from '@liquid-labs/question-and-answer'

import { getBackupFiles } from './lib/get-backup-files'
import { BACKUP_DIR } from '../../constants'

const backupsDelete = async({ backupFiles }) => {
  const backupEntries = await getBackupFiles()

  if (backupFiles === undefined || backupFiles.length === 0) {
    const interrogationBundle = {
      actions: [
        {
          prompt: "Select one or more files to delete:",
          parameter: 'BACKUP_FILES',
          multiValue: true,
          options: backupEntries.map(({ fileName }) => fileName)
        }
      ]
    }
    const questioner = new Questioner({ interrogationBundle })
    await questioner.question()

    backupFiles = questioner.get('BACKUP_FILES')
  }

  backupFiles = backupFiles.map((fileName) => {
    const entry = backupEntries.find(({ fileName: testName }) => fileName === testName)
    if (entry === undefined) {
      throw new Error(`Could not locate backup file '${fileName}'.`)
    }
    return entry.filePath
  })

  process.stdout.write(`Deleting ${getBackupFiles.length} backup files...\n`)

  const rmOps = backupFiles.map((filePath) => fs.rm(filePath))
  await Promise.all(rmOps)

  process.stdout.write('Deletion complete.\n')
}

export { backupsDelete }