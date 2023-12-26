import { tryExecAsync } from '@liquid-labs/shell-toolkit'

import { confirmAction } from './lib/confirm-action'
import { selectBackups } from './lib/select-backups'
import { getProjectData } from '../lib/terraform-lib'

const backupsRestore = async({ backupFile, confirm, target }) => {
  const backupFiles = backupFile === undefined ? undefined : [backupFile]
  // will always be an array of one
  const backupEntries = await selectBackups({ backupFiles, multiValue : false })
  if (backupEntries.length !== 1) {
    throw new Error(`Unexpected number of backups (${backupEntries.length}) selected for restoration. Must select exactly one.`)
  }
  const backupEntry = backupEntries[0]

  if (target === undefined) {
    target = backupEntry.serverName
    // TODO: verify target is a valid server name
  }

  await confirmAction({ actionDescription : 'restore backup file ' + backupEntry.fileName, confirm })

  process.stdout.write(`Restoring ${backupEntry.fileName} on ${target}...\n`)

  const projectData = await getProjectData()
  const instance = `cloudcraft-host-${target}`
  const project = projectData.project_id.value
  const zone = projectData.zone.value

  process.stdout.write('Stopping Minecraft process...\n')
  const stopMinecraftCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo docker stop mc'`
  try {
    await tryExecAsync(stopMinecraftCommand)
  }
  catch (e) {
    throw new Error('There was an error stopping the minecraft server: ' + e.message)
  }

  process.stdout.write('Clearing current server files...\n')
  const rmCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo rm -rf /var/lib/docker/cloudcraft/*'`
  try {
    await tryExecAsync(rmCommand)
  }
  catch (e) {
    throw new Error('There was an error clearing the server directory: ' + e.message)
  }

  process.stdout.write(`Copying backup to ${target}...\n`)
  const { serverName, filePath: sourcePath, fileName: tarFile } = backupEntry
  const copyCommand = `gcloud compute scp ${sourcePath} ${instance}:/var/lib/docker/cloudcraft/${tarFile} --zone=${zone} --project=${project}`
  try {
    await tryExecAsync(copyCommand)
  }
  catch (e) {
    throw new Error('There was an error copying the backup file: ' + e.message)
  }

  process.stdout.write('Extracting backup...\n')
  const extractCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo bash -c "cd /var/lib/docker/cloudcraft; tar xzf ${tarFile}"'`
  try {
    await tryExecAsync(extractCommand)
  }
  catch (e) {
    throw new Error('There was an error extracting the backup file: ' + e.message)
  }

  process.stdout.write('Removing the remote bockup file...\n')
  const cleanupCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo bash -c "cd /var/lib/docker/cloudcraft; rm ${tarFile}"'`
  try {
    await tryExecAsync(cleanupCommand)
  }
  catch (e) {
    throw new Error('There was an error re-starting the minecraft server: ' + e.message)
  }

  process.stdout.write('Resarting the Minecraft process...\n')
  const restartMinecraftCommand = `gcloud compute ssh ${instance} --zone=${zone} --project=${project} --command='sudo docker restart mc'`
  try {
    await tryExecAsync(restartMinecraftCommand)
  }
  catch (e) {
    throw new Error('There was an error re-starting the minecraft server: ' + e.message)
  }

  process.stdout.write(`Restored ${tarFile} to ${serverName}.\n`)
}

export { backupsRestore }
