export const VALID_SERVER_TYPES = ['bedrock', 'java']

export const cliSpec = {
  mainCommand : 'cloudcraft',
  mainOptions : [
    { name : 'command', defaultOption : true, description: 'The command to run or a sub-command group.' },
    { name : 'quiet', alias: 'q', type: Boolean, descirption: 'Makes informational output less chatty.' },
    {
      name        : 'throw-error',
      type        : Boolean,
      description : 'In the case of an exception, the default is to print the message. When --throw-error is set, the exception is left uncaught.'
    }
  ],
  commands : [
    {
      name      : 'backups',
      summary   : 'Selects backup commands.',
      arguments : [
        { name : 'command', defaultOption : true, required : true, description : 'The backup action to perform.' }
      ],
      commands : [
        {
          name        : 'create',
          summary     : 'Backs up the named server.',
          description : 'Zips the remote server files and copies them to the cloudcraft data directory.',
          arguments   : [
            {
              name          : 'server-name',
              description   : 'Name of the server to backup.',
              defaultOption : true,
              required      : true
            }
          ]
        },
        {
          name        : 'delete',
          summary     : 'Deletes the named or chosen backups.',
          description : 'Deletes the specified backup file(s) or, if none specified, asks the user to choose one or more files for deletion.',
          arguments   : [
            {
              name          : 'backup-files',
              description   : 'The backup file(s) to delete.',
              defaultOption : true,
              multiple      : true
            },
            {
              name        : 'confirm',
              description : "If set, then the 'yes/no' confirmation will be skipped.",
              default     : ' false'
            }
          ]
        },
        {
          name      : 'list',
          summary   : 'Lists the current backups.',
          arguments : [
            {
              name        : 'format',
              description : "Specifies the format of the output. Can be 'terminal' (default), 'json', or 'yaml'.",
              default     : 'terminal'
            }
          ]
        },
        {
          name        : 'restore',
          summary     : 'Restores the named or chosen backup.',
          description : "Restores the specified backup or, if none specified, asks the user to choose a backup to restore. By default, the backup will be restored to the server from which it originated. This can be changed with the '--target' option.",
          arguments   : [
            {
              name          : 'backup-file',
              description   : 'The backup file to restore.',
              defaultOption : true
            },
            {
              name        : 'confirm',
              description : "If set, then the 'yes/no' confirmation will be skipped.",
              default     : ' false'
            },
            {
              name        : 'target',
              description : 'The server to restore the backup to.'
            }
          ]
        }
      ]
    },
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
      name      : 'destroy',
      summary   : 'Destroys the named server or all resources.',
      arguments : [
        {
          name        : 'all',
          type        : Boolean,
          description : "If true, then destroys all infrastructure. Incompatible with '--server-name'."
        },
        {
          name        : 'confirm',
          type        : Boolean,
          description : "If set, then the 'yes/no' confirmation will be skipped.",
          default     : false
        },
        { name : 'plan', type : Boolean, description : 'Prints the destroy plan without actually doing anything.' },
        { name : 'server-name', defaultOption : true, description : 'The name of the server to destroy.' }
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
      name        : 'ssh',
      summary     : 'Displays the proper SSH command or executes specified command on remote server.',
      description : `The 'ssh' command, with no options, is used to generate and display the SSH command you would use to log into the specified server. With '--eval-mode', you can do:
\`\`\`
eval $(cloudcraft ssh --eval-mode some-sever
\`\`\`
You can also use the \`--command\` option to execute a single command.
`,
      arguments : [
        {
          name          : 'server-name',
          defaultOption : true,
          required      : true,
          description   : 'The name of the server to log into.'
        },
        { name : 'command', description : 'Will run the specified command and exit.' },
        {
          name        : 'eval-mode',
          description : "Produces output suitable to 'eval $(cloudcraft ssh a-server)'.",
          type        : Boolean
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
        { name : 'server-name', defaultOption : true, required : true, description : 'The name of the server to describe.' },
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
    {
      name        : 'terraform',
      summary     : 'Runs the terraform command, as specified, in the staged Cloudcraft terraform directory. This command is meant primarily for developers.',
      description : "The entire command (everything after 'cloudcraft') is executed from the Cloudcraft terraform staging directory. E.g., 'cloudcraft terraform plan -no-color' executes 'terraform plan -no-color'."
    }
  ]
}
