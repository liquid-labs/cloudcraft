export const VALID_SERVER_TYPES = ['bedrock', 'java']

export const commands = [
  { name : 'create', summary : 'Creates (sets up) a cloud-based Minecraft server.' },
  { name : 'help', summary : 'Prints command help.' },
  { name : 'list', summary : 'Lists Minecraft servers.' }
]

export const mainOptionsDef = [
  { name : 'command', defaultOption : true }
]

export const createOptionsDef = [
  { name : 'name', defaultOption : true, description : 'The name of the server to create.' },
  { name : 'server-type', default : 'bedrock', description : `May be one of: ${VALID_SERVER_TYPES.join(', ')}` }
]
