import { getConfig } from './lib/config-lib'

const list = async({ quiet }) => {
  const config = await getConfig()

  if (config.servers === undefined || config.servers.length === 0) {
    if (quiet !== true) {
      process.stdout.write('No servers found.\n')
    }
  }
  else {
    for (const server of Object.keys(config.servers)) {
      process.stdout.write(server + '\n')
    }
  }
}

export { list }
