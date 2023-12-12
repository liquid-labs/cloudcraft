import commandLineUsage from 'command-line-usage'

import { commands, createOptionsDef } from './constants'

const handleHelp = ({ argv }) => {
  const helpCommand = argv[0]

  let sections
  if (helpCommand === undefined) {
    sections = [
      { header : 'cloudcraft', content : 'Manage Minecraft servers in the cloud.' },
      {
        header  : 'Usage',
        content : `cloudcraft [command] [options]

Use 'cloudcraft help [command]' to get details on command options.`
      },
      {
        header  : 'Commands',
        content : commands
      }
    ]
  }
  else if (helpCommand === 'create') {
    const createOptionsSansDefault = structuredClone(createOptionsDef)
    createOptionsSansDefault.splice(createOptionsSansDefault.findIndex(({ defaultOption }) => defaultOption), 1)
    sections = [
      {
        header  : 'cloudcraft create [options] [name]',
        content : commands.find(({ name }) => name === 'create').summary
      },
      { header : 'Options', optionList : createOptionsSansDefault },
      {
        header  : 'Details',
        content : 'Creates a server named {underline name}. This is, by default, a \'bedrock\' server.'
      }
    ]
  }
  else {
    process.stderr.write(`Cannot provide help on unknown command '${helpCommand}'.`)
    process.exit(1)
  }

  const usage = commandLineUsage(sections)
  process.stdout.write(usage + '\n')
}

export { handleHelp }
