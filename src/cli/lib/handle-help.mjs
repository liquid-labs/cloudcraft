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
    const title = 'cloudcraft create <options> [name]'
    const details = 'Creates a server named {underline name}. This is, by default, a \'bedrock\' server.'
    sections = makeSections({ command: 'create', details, options: createOptionsDef, details })
  }
  else if (helpCommand === 'info') {
    const title = 'cloudcraft info [options] [name]'
    const details = 'Displays info about the servers or, if {underline name} supplied, a server. By default will display all information. If one or more info select options is provided, then it will only display that information.'
    sections = makeSections({ command: 'info', details, options: infoOptionsDef, title })
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

const makeSections = ({ command, details, options, title }) => {
  const optionList = options.map((v) => Object.assign({}, v))
  optionList.splice(optionList.findIndex(({ defaultOption }) => defaultOption ), 1)
  return [
    { header: title, content: commands.find(({ name }) => name === command ).summary },
    { header: 'Options', optionList },
    { header: 'Details', content: details }
  ]
}

export { handleHelp }
