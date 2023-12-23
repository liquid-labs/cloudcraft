import { find } from 'find-plus'
import yaml from 'js-yaml'

import { BACKUP_DIR } from '../../constants'

const backupsList = async({ format }) => {
  const isATar = (file) => file.name.endsWith('.tar.gz')
  const backupFiles = await find({ onlyFiles: true, root: BACKUP_DIR, test: isATar })
  const backupFileRE = /([^/]+)\/([^/]+\.([0-9-]+)\.tar\.gz)$/
  const backupEntries = backupFiles.map((filePath) => {
    const match = filePath.match(backupFileRE)
    const [,serverName, fileName, timestamp] = match
    return { fileName, filePath, serverName, timestamp }
  })

  backupEntries.sort((a, b) => a.fileName.localeCompare(b.fileName))

  if (format === 'json') {
    process.stdout.write(JSON.stringify(backupEntries) + '\n')
  }
  else if (format === 'yaml') {
    process.stdout.write(yaml.dump(backupEntries) + '\n')
  }
  else {
    let lastServer
    for (const { fileName, serverName } of backupEntries) {
      if (serverName !== lastServer) {
        process.stdout.write(serverName + ':\n')
      }
      process.stdout.write('  ' + fileName + '\n')
      lastServer = serverName
    }
  }
}

export { backupsList }