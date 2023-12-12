import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

import { create } from '../lib/actions'

const VALID_SERVER_TYPES = ['bedrock', 'java']

const commands = [
  { name: 'create', summary: 'Creates (sets up) a cloud-based Minecraft server.' },
  { name: 'help', summary: 'Prints command help.'}
]

const mainOptionsDef = [
  { name: 'command', defaultOption: true }
]

const createOptionsDef = [
  { name: 'server-type', default: 'bedrock', description: `May be one of: ${VALID_SERVER_TYPES.join(', ')}` }
]

const cloudcraft = async() => {
  const mainOptions = commandLineArgs(mainOptionsDef, { stopAtFirstUnknown: true })
  const argv = mainOptions._unknown || []

  const { command } = mainOptions

  if (command === 'create') {
    const createOptions = commandLineArgs(createOptionsDef, { argv })

    const serverType = createOptions['server-type'] 
    if (!VALID_SERVER_TYPES.includes(serverType)) {
      process.stderr.write(`Invalid server type '${serverType}'; must be one of: ${VALID_SERVER_TYPES.join(', ')}`)
    }

    await create({ serverType })
  }
  else if (command === 'help' || command === undefined) {
    const helpCommand = argv[0]

    let sections
    if (helpCommand === undefined) {
      sections = [
        { header: 'cloudcraft', content: 'Manage Minecraft servers in the cloud.' },
        { 
          header: 'Usage', 
          content: `cloudcraft [command] [options]

  Use 'cloudcraft help [command]' to get details on command options.` 
        },
        { 
          header: 'Commands', 
          content: commands
        },
      ]
    }
    else if (helpCommand === 'create') {
      sections = [
        { header: 'cloudcraft create', content: commands.find(({ name }) => name === 'create').summary },
        { header: 'Options', optionList: createOptionsDef}
      ]
    }
    else {
      process.stderr.write(`Cannot provide help on unknown command '${helpCommand}'.`)
      process.exit(1)
    }

    const usage = commandLineUsage(sections)
    process.stdout.write(usage + '\n')
  }
}

export { cloudcraft }