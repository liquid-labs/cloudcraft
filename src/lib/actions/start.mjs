import { InstancesClient } from '@google-cloud/compute'

import { deployTerraform, getProjectData, stageTerraformFiles } from './lib/terraform-lib'

const start = async({ name, noPing = false, refresh }) => {
  process.stdout.write(`Starting '${name}'...\n`)

  if (refresh === true) {
    await stageTerraformFiles()
    await deployTerraform()
  }

  const projectData = await getProjectData()
  const instancesClient = new InstancesClient()
  const [ioOperation] = await instancesClient.start({
    instance : `cloudcraft-host-${name}`,
    project  : projectData.project_id.value,
    zone     : projectData.zone.value
  })

  const { done, latestResponse } = ioOperation

  if (done === true) {
    process.stdout.write('Server started.')
  }
  else {
    const { warnings } = latestResponse
    if (warnings && warnings.length > 0) {
      process.stdout.write('Server started with warnings:\n')
      for (const warning of warnings) {
        process.stdout.write('- ' + warning + '\n')
      }
    }

    process.stdout.write(`Server starting. Try:\n\ncloudcraft status ${name}\n\nto get current status.`)
  }
}

export { start }
