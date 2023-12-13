import { getConfig } from './lib/config-lib'

const list = async({ name }) => {
  const config = await getConfig()

  for (const server of Object.keys(config.servers)) {
    process.stdout.write(server + '\n')
  }
}

export { list }
