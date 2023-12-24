import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { getProjectData } from './lib/terraform-lib'

const ssh = async({ command, evalMode, name }) => {
  const projectData = await getProjectData()
  const instance = `cloudcraft-host-${name}`
  const project = projectData.project_id.value
  const zone = projectData.zone.value

  let sshCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project}`
  if (command) {
    sshCommand += ' --command="' + command.replaceAll(/(^|[^\\])"/g, '$1\\"') + '"'
  }
  else {
    if (evalMode !== true) {
      process.stdout.write(`To log into ${name}, execute:\n\n`)
    }
    process.stdout.write(sshCommand + '\n')
    return
  }
  const { code, stderr, stdout } = await tryExecAsync(sshCommand, { noThrow : true })

  if (code !== 0) {
    process.stderr.write('SSH command failed:\n' + stderr)
  }
  if (stdout) {
    process.stdout.write(stdout)
  }
}

export { ssh }
