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
      { header : 'Commands', content : cliSpec.commands.map(({ name, summary }) => ({ name, summary })) }
    ]
  }
  else if (helpCommand === 'backups') {
    const backupsSpec = cliSpec.commands.find(({ name }) => name === 'backups')
    const backupCommand = argv[1]

    if (backupCommand === undefined) {
      sections = [
        {
          header  : 'cloudcraft backups <options> [command]',
          content : 'Manages local cloudcraft backups.'
        },
        {
          header  : 'Commands',
          content : backupsSpec.commands.map(({ name, summary }) => ({ name, summary }))
        }
      ]
    }
    else {
      sections = makeSections({ command : backupCommand, commandsSpec : backupsSpec, prefix : 'cloudcraft backups' })
    }
  }
  else {
    sections = makeSections({ command : helpCommand, prefix : 'cloudcraft' })
  }

  const usage = commandLineUsage(sections)
  process.stdout.write(usage + '\n')
}

const makeSections = ({ command, commandsSpec = cliSpec, prefix }) => {
  const commandSpec = commandsSpec.commands.find(({ name }) => name === command)

  if (commandSpec === undefined) {
    process.stderr.write(`No such command '${command}'.\n\n`)
    handleHelp({ argv : [] })
    process.exit(1)
  }

  const details = commandSpec.description
  const options = commandSpec.arguments || []

  const optionList = options.map((v) => Object.assign({}, v))
  const defaultOptionIndex = optionList.findIndex(({ defaultOption }) => defaultOption)

  let title = prefix + ' ' + command
  let defaultOptionSpec

  if (defaultOptionIndex !== -1) {
    defaultOptionSpec = optionList[defaultOptionIndex]
    optionList.splice(defaultOptionIndex, 1)
  }

  if (optionList.length > 0) {
    title += ' <options>'
  }

  if (defaultOptionSpec !== undefined) {
    const { name, required } = defaultOptionSpec
    title += required === true ? ` [${name}]` : ` <${name}>`
  }

  const sections = [{ header : title, content : commandSpec.summary }]
  if (optionList.length > 0) {
    sections.push({ header : 'Options', optionList })
  }
  if (details !== undefined) {
    sections.push({ header : 'Details', content : details })
  }

  return sections
}

export { handleHelp }
