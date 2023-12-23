import commandLineArgs from 'command-line-args'

import { backupsCreate } from '../../../lib/actions'

const handleBackupsCreate = async({ argv, backupsCLISpec }) => {
  const createOptionsSpec = backupsCLISpec.commands.find(({ name }) => name === 'create').arguments
  const createOptions = commandLineArgs(createOptionsSpec, { argv })
  const name = createOptions['server-name']

  await backupsCreate({ name })
}

export { handleBackupsCreate }
