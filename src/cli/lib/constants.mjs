export const VALID_SERVER_TYPES = ['bedrock', 'java']

export const cliSpec = {
  mainOptions : [
    { name : 'command', defaultOption : true },
    {
      name        : 'throw-error',
      type        : Boolean,
      description : 'In the case of an exception, the default is to print the message. When --throw-error is set, the exception is left uncaught.'
    }
  ],
  commands : [
    {
      name        : 'create',
      summary     : 'Creates (sets up) a cloud-based Minecraft server managed by Cloudcraft.',
      description : 'Creates a server named {underline server-name}. This is, by default, a \'bedrock\' server.',
      arguments   : [
        {
          name          : 'server-name',
          defaultOption : true,
          description   : 'The name of the server to create.',
          required      : true
        },
        { name : 'server-type', default : 'bedrock', description : `May be one of: ${VALID_SERVER_TYPES.join(', ')}` }
      ]
    },
    {
      name      : 'help',
      summary   : 'With no command specified, prints a list of available commands or, when a command is specified, prints help for the specified command.',
      arguments : [
        { name : 'command', defaultOption : true, description : 'The command to print help for.' }
      ]
    },
    {
      name        : 'info',
      summary     : 'Prints info about the Minecraft server(s).',
      description : 'Displays info about the servers or, if {underline name} supplied, a server. By default will display all information. If one or more info select options is provided, then it will only display that information.',
      arguments   : [
        { name : 'server-name', defaultOption : true, description : 'The name of the server to get into on.' },
        { name : 'ip-address', type : Boolean, description : 'Select the public IP address for display.' },
        { name : 'machine-type', type : Boolean, description : 'Select the machine type for display.' },
        {
          name        : 'refresh',
          type        : Boolean,
          description : 'Updates underlying terraform files and applies the results before reading the output.'
        }
      ]
    },
    { name : 'list', summary : 'Lists Cloudcraft managed Minecraft servers.' },
    { 
      name: 'ssh', 
      summary: 'Displays the proper SSH command or executes specified command on remote server.',
      description: `The 'ssh' command, with no options, is used to generate and display the SSH command you would use to log into the specified server. With '--eval-mode', you can do:
\`\`\`
eval $(cloudcraft ssh --eval-mode some-sever
\'\'\'
You can also use the \`--command\` option to execute a single command.
`,
      arguments: [
        { 
          name: 'server-name', 
          defaultOption: true, 
          required: true, 
          description: 'The name of the server to log into.' 
        },
        { name: 'command', description: 'Will run the specified command and exit.' },
        { 
          name: 'eval-mode', 
          description: "Produces output suitable to 'eval $(cloudcraft ssh a-server)'.", 
          type: Boolean 
        }
      ]
    },
    {
      name      : 'start',
      summary   : 'Starts the named Minecraft server.',
      arguments : [
        { name : 'server-name', defaultOption : true, required : true, description : 'The name of the server to start.' },
        {
          name        : 'refresh',
          description : 'Updates and applies the terraform configuration before starting the server.',
          type        : Boolean
        }
      ]
    },
    {
      name        : 'status',
      summary     : 'Displays the status of a Minecraft server.',
      description : "Tries to determine the if the server is up, it's ping status, and disk usage.",
      arguments   : [
        { name : 'server-name', defaultOption : true, requried : true, description : 'The name of the server to describe.' },
        { name : 'no-ping', type : Boolean, description : 'Skips the ping test when set.' },
        {
          name        : 'refresh',
          description : 'Updates and applies the terraform configuration before resolving the server status.',
          type        : Boolean
        }
      ]
    },
    {
      name      : 'stop',
      summary   : 'Stops the named Minecraft server.',
      arguments : [
        { name : 'server-name', defaultOption : true, required : true, description : 'The name of the server to stop.' },
        {
          name        : 'refresh',
          description : 'Updates and applies the terraform configuration before stoping the server.',
          type        : Boolean
        }
      ]
    },
  ]
}
