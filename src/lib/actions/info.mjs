import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { BUILD_DIR } from './lib/constants'

const info = async({ name }) => {
  const jsonContent = (await tryExecAsync(`cd '${BUILD_DIR}' && terraform output -json`)).stdout

  process.stdout.write(jsonContent + '\n')
}

export { info }
