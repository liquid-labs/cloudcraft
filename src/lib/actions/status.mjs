import ping from 'ping'

import { InstancesClient } from '@google-cloud/compute'
import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { getServerData } from './lib/terraform-lib'

const status = async({ name, noPing = false }) => {
  process.stdout.write(name)
  const instancesClient = new InstancesClient()
  const [instanceData] = await instancesClient.get({ 
    instance: 'cloudcraft-host-third-world', 
    project: 'cloudcraft-77e89be796ac30dc', 
    zone: 'us-central1-c' 
  })
  const hostStatus = instanceData.status
  const hostRunning = hostStatus === 'RUNNING'
  process.stdout.write(`host status: ${hostStatus}\n`)

  if (hostRunning === true && noPing !== true) {
    // const ip = (await getServerData(name)).ip_address
    const res = await getServerData(name)
    const ip = res.ip_address
    let pingResult = await ping.promise.probe(ip, { min_reply: 6 })
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
    const dfReport = (await tryExecAsync(`gcloud compute ssh cloudcraft-host-third-world --zone=us-central1-c --project=cloudcraft-77e89be796ac30dc --command='sudo bash -c "cd /var/lib/docker/cloudcraft && df -h" | grep cloudcraft'`)).stdout

    const [,available,used/*,free*/] = dfReport.split(/ +/)

    process.stdout.write(`disk usage: ${used}/${available}\n`)
  }
}

export { status }