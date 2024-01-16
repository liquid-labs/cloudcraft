import * as fsPath from 'node:path'

export const BACKUP_DIR = fsPath.join(process.env.HOME, '.local', 'share', 'cloudcraft', 'backups')
