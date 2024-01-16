import { InstancesClient } from '@google-cloud/compute'

import { deployTerraform, getProjectData, stageTerraformFiles } from './lib/terraform-lib'

const stop = async({ name, refresh }) => {
  process.stdout.write(`Stopping '${name}'...\n`)

  if (refresh === true) {
    await stageTerraformFiles()
    await deployTerraform()
  }

  const projectData = await getProjectData()
  const instancesClient = new InstancesClient()
  const [ioOperation] = await instancesClient.stop({
    instance : `cloudcraft-host-${name}`,
    project  : projectData.project_id,
    zone     : projectData.zone
  })

  const { done, latestResponse } = ioOperation

  if (done === true) {
    process.stdout.write('Server stopped.')
  }
  else {
    const { warnings } = latestResponse
    if (warnings && warnings.length > 0) {
      process.stdout.write('Server stopping with warnings:\n')
      for (const warning of warnings) {
        process.stdout.write('- ' + warning + '\n')
      }
    }

    process.stdout.write(`Server is stopping. Try:\n\ncloudcraft status ${name}\n\nto get current status.\n`)
  }
}

export { stop }
