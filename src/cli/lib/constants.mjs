export const VALID_SERVER_TYPES = ['bedrock', 'java']

export const commands = [
  { name : 'create', summary : 'Creates (sets up) a cloud-based Minecraft server.' },
  { name : 'help', summary : 'Prints command help.' },
  { name : 'info', summary : 'Prints info about the server(s).'},
  { name : 'list', summary : 'Lists Minecraft servers.' }
]

export const mainOptionsDef = [
  { name : 'command', defaultOption : true }
]

export const createOptionsDef = [
  { name : 'name', defaultOption : true, description : 'The name of the server to create.' },
  { name : 'server-type', default : 'bedrock', description : `May be one of: ${VALID_SERVER_TYPES.join(', ')}` }
]

export const infoOptionsDef = [
  { name : 'name', defaultOption : true, description : 'The name of the server to get into on.' },
  { name : 'ip-address', type: Boolean, description : 'Select the public IP address for display.' },
  { name : 'machine-type', type: Boolean, description: 'Select the machine type for display.'}
]
