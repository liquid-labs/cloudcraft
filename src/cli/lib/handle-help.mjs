import commandLineUsage from 'command-line-usage'

import { cliSpec } from './constants'

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
      { header  : 'Commands', content : cliSpec.commands.map(({ name, summary }) => ({ name, summary })) }
    ]
  }
  else if (helpCommand === 'create') {
    const title = 'cloudcraft create <options> [name]'
    sections = makeSections({ command: 'create', title })
  }
  else if (helpCommand === 'info') {
    const title = 'cloudcraft info [options] [name]'
    sections = makeSections({ command: 'info', title })
  }
  else if (helpCommand === 'list') {
    sections = [
      { header : 'cloudcraft list', content: cliSpec.commands.find(({ name }) => name === 'list').summary }
    ]
  }
  else if (helpCommand === 'status') {
    const title = 'cloudcraft status [name]',
    sections = makeSections({ command: 'status', title })
  }
  else {
    process.stderr.write(`Cannot provide help on unknown command '${helpCommand}'.`)
    process.exit(1)
  }

  const usage = commandLineUsage(sections)
  process.stdout.write(usage + '\n')
}

const makeSections = ({ command, title }) => {
  const commandSpec = cliSpec.commands.find(({ name }) => name === command)
  const details = commandSpec.description
  const options = commandSpec.arguments
  const optionList = options.map((v) => Object.assign({}, v))
  optionList.splice(optionList.findIndex(({ defaultOption }) => defaultOption ), 1)
  return [
    { header: title, content: cliSpec.commands.find(({ name }) => name === command ).summary },
    { header: 'Options', optionList },
    { header: 'Details', content: details }
  ]
}

export { handleHelp }
