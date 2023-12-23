import yaml from 'js-yaml'

import { getBackupFiles } from './lib/get-backup-files'

const backupsList = async({ format }) => {
  const backupEntries = await getBackupFiles()

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