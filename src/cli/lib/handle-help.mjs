import commandLineUsage from 'command-line-usage'

import { commands, createOptionsDef, infoOptionsDef } from './constants'

const handleHelp = ({ argv }) => {
  const helpCommand = argv[0]

  let sections
  if (helpCommand === undefined) {
    sections = [
      { header : 'cloudcraft', content : 'Manage Minecraft servers in the cloud.' },
      {
        header  : 'Usage',
        content : `cloudcraft <command> <options>

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
        header  : 'cloudcraft create <options> [name]',
        content : commands.find(({ name }) => name === 'create').summary
      },
      { header : 'Options', optionList : createOptionsSansDefault },
      {
        header  : 'Details',
        content : 'Creates a server named {underline name}. This is, by default, a \'bedrock\' server.'
      }
    ]
  }
  else if (helpCommand === 'info') {
    const infoOptionsSansDefault = infoOptionsDef.map((v) => Object.assign({}, v))
    infoOptionsSansDefault.splice(infoOptionsSansDefault.findIndex(({ defaultOption }) => defaultOption), 1)
    sections = [
      {
        header: 'cloudcraft info [options] [name]',
        content: commands.find(({ name }) => name === 'info').summary
      },
      { header: 'Options', optionList: infoOptionsSansDefault },
      {
        header: 'Details',
        content: 'Displays info about the servers or, if {underline name} supplied, a server. By default will display all information. If one or more info select options is provided, then it will only display that information.'
      }
    ]
  }
  else if (helpCommand === 'list') {
    sections = [
      { header : 'cloudcraft list', content: commands.find(({ name }) => name === 'list').summary }
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
