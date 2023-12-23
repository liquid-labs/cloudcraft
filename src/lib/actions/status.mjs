import ping from 'ping'

import { InstancesClient } from '@google-cloud/compute'
import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { deployTerraform, getProjectData, stageTerraformFiles } from './lib/terraform-lib'

const status = async({ name, noPing = false, refresh }) => {
  process.stdout.write(name)

  if (refresh === true) {
    await stageTerraformFiles()
    await deployTerraform()
  }

  const projectData = await getProjectData()
  const instancesClient = new InstancesClient()

  const instance = `cloudcraft-host-${name}`
  const project = projectData.project_id.value
  const zone = projectData.zone.value

  const [instanceData] = await instancesClient.get({
    instance,
    project,
    zone  
  })
  const hostStatus = instanceData.status
  const hostRunning = hostStatus === 'RUNNING'
  process.stdout.write(`host status: ${hostStatus}\n`)

  if (hostRunning === true && noPing !== true) {
    // const ip = (await getServerData(name)).ip_address
    const serverData = projectData.servers.value[name]
    const ip = serverData.ip_address
    const pingResult = await ping.promise.probe(ip, { min_reply : 6 })
    const { avg } = pingResult
    let rating
    if (avg < 25) {
      rating = 'excellent'
    }
    else if (avg < 50) {
      rating = 'very good'
    }
    else if (avg < 75) {
      rating = 'good'
    }
    else if (avg < 100) {
      rating = 'fair'
    }
    else if (avg < 150) {
      rating = 'poor'
    }
    else if (avg < 200) {
      rating = 'bad'
    }
    else {
      rating = 'terrible'
    }
    process.stdout.write(`avg ping: ${avg}ms (${rating})\n`)
  }

  if (hostRunning === true) {
    try {
      const dfReport = (await tryExecAsync(`gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo bash -c "cd /var/lib/docker/cloudcraft && df -h" | grep cloudcraft'`)).stdout

      const [, available, used/*, free */] = dfReport.split(/ +/)
      process.stdout.write(`disk usage: ${used}/${available}\n`)
    }
    catch (e) {
      process.stderr.write('Could not determine disk usage:\n' + e.message)
    }
  }
}

export { status }
