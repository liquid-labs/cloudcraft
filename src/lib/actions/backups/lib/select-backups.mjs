import { getBackupFiles } from './get-backup-files'

const selectBackups = async ({ multiValue = false } = {}) => {
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

  return backupFiles
}

export { selectBackups }