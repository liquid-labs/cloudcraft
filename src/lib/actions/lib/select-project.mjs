import { ProjectsClient } from '@google-cloud/resource-manager'
import { Questioner } from '@liquid-labs/question-and-answer'

import { CREATE_LABEL } from './constants'

const selectProject = async({ config, organizationName, requireDisplayName = false }) => {
  const projectsClient = new ProjectsClient()

  let { projectName, projectId } = config

  if (projectName !== undefined && projectId !== undefined) {
    let projectDisplayName
    if (requireDisplayName === true) {
      const [project] = await projectsClient.getProject({ name : projectName })
      projectDisplayName = project.displayName
    }

    return { projectDisplayName, projectId, projectName }
  }

  const projects = organizationName === undefined
    ? projectsClient.searchProjectsAsync()
    : projectsClient.listProjectsAsync({ parent : organizationName })
  const projectOptions = []
  const projectData = []

  for await (const project of projects) {
    if (!project.projectId.startsWith('sys-') && (organizationName !== null || !project.parentId)) {
      projectOptions.push(project.displayName)
      projectData.push(project)
    }
  }

  projectOptions.push(CREATE_LABEL)
  const projectsIB = {
    actions : [
      { prompt : 'Select a project to use:', options : projectOptions, parameter : 'PROJ_DISPLAY_NAME' }
    ]
  }

  const projectQuestioner = new Questioner({ interrogationBundle : projectsIB })
  await projectQuestioner.question()

  const projectDisplayName = projectQuestioner.get('PROJ_DISPLAY_NAME')

  if (projectDisplayName === CREATE_LABEL) {
    const createIB = {
      actions : [
        { 
          prompt : "What should the new project be called? (use lowercase alphanumeric + '-')", 
          requireMatch: '^[a-z0-9-]+$',
          parameter : 'PROJ_ID' 
        }
      ]
    }

    const createQuestioner = new Questioner({ interrogationBundle : createIB })
    await createQuestioner.question()
    const projectId = createQuestioner.get('PROJ_ID')
    // TODO: chechk that the project is available and loop on question if not

    return { projectId }
  }
  else {
    const project = projectData.find(({ displayName }) => displayName === projectDisplayName)
    projectName = project.name
    projectId = project.projectId

    config.projectName = projectName
    config.projectId = projectId

    return { projectDisplayName, projectId, projectName }
  }
}

export { selectProject }
