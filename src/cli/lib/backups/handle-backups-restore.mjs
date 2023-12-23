import commandLineArgs from 'command-line-args'

import { backupsRestore } from '../../../lib/actions'

const handleBackupsRestore = async({ argv, backupsCLISpec }) => {
  const restoreOptionsSpec = backupsCLISpec.commands.find(({ name }) => name === 'restore').arguments
  const restoreOptions = commandLineArgs(restoreOptionsSpec, { argv })
  const backupFile = restoreOptions['backup-file']
  const { target } = restoreOptions

  await backupsRestore({ backupFile, target })
}

export { handleBackupsRestore }
