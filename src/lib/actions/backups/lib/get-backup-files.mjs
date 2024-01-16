import { find } from 'find-plus'

import { BACKUP_DIR } from '../../../constants'

const getBackupFiles = async() => {
  const isATar = (file) => file.name.endsWith('.tar.gz')
  const backupFiles = await find({ onlyFiles : true, root : BACKUP_DIR, test : isATar })
  const backupFileRE = /([^/]+)\/([^/]+\.([0-9-]+)\.tar\.gz)$/
  const backupEntries = backupFiles.map((filePath) => {
    const match = filePath.match(backupFileRE)
    const [, serverName, fileName, timestamp] = match
    return { fileName, filePath, serverName, timestamp }
  })

  backupEntries.sort((a, b) => a.fileName.localeCompare(b.fileName))

  return backupEntries
}

export { getBackupFiles }
