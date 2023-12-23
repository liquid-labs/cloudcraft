import * as fs from 'node:fs/promises'
import * as fsPath from 'node:path'

import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { getProjectData } from '../lib/terraform-lib'

const backupsCreate = async ({ name }) => {
  process.stdout.write('Starting backup...\n')

  const projectData = await getProjectData()
  const instance = `cloudcraft-host-${name}`
  const project = projectData.project_id.value
  const zone = projectData.zone.value

  const now = new Date()
  const dateString = now.getUTCFullYear() + '-'
    + ('' + (now.getUTCMonth() + 1)).padStart(2, '0') + '-'
    + ('' + now.getUTCDate()).padStart(2,'0') + '-'
    + ('' + now.getUTCHours()).padStart(2, '0')
    + ('' + now.getUTCMinutes()).padStart(2, '0')
    + ('' + now.getUTCSeconds()).padStart(2, '0')

  const tarFile = `${instance}.backup.${dateString}.tar.gz`

  const tarCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo bash -c "cd /var/lib/docker/cloudcraft; tar czf ${tarFile} *; chmod a+r ${tarFile}"'`

  process.stdout.write(`Creating backup file ${tarFile}...\n`)
  try {
    await tryExecAsync(tarCommand)
  }
  catch (e) {
    throw new Error('There was an error creating the tar file: ' + e.message)
  }

  const targetDir = fsPath.join(process.env.HOME, '.local', 'share', 'cloudcraft', name)
  await fs.mkdir(targetDir, { recursive: true })


  const copyCommand = `gcloud compute scp ${instance}:/var/lib/docker/cloudcraft/${tarFile} ${targetDir} --zone=${zone} --project=${project}`
  process.stdout.write(`Copying backup to ${targetDir}...\n`)
  try {
    await tryExecAsync(copyCommand)
  }
  catch (e) {
    throw new Error('There was an error copying the backup file: ' + e.message)
  }

  const cleanupCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo bash -c "rm /var/lib/docker/cloudcraft/${tarFile}"'`

  process.stdout.write(`Cleaning up remote backup file...\n`)
  try {
    await tryExecAsync(cleanupCommand)
  }
  catch (e) {
    throw new Error('There was an error cleaning up the backup file: ' + e.message)
  }
}

export { backupsCreate }