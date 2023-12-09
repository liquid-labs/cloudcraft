import { ProjectsClient } from '@google-cloud/resource-manager'
import { Questioner } from '@liquid-labs/question-and-answer'

import { CREATE_LABEL } from './constants'

const selectProject = async ({ config, organizationName }) => {
  const projectsClient = new ProjectsClient()

  let { projectName } = config

  if (projectName !== undefined) {
    const [project] = await projectsClient.getProject({ name: projectName })
    console.log('project:', project) // DEBUG

    return { projectDisplayName: project.displayName, projectId: project.projectId, projectName }
  }

  const projects = organizationName === undefined 
    ? projectsClient.searchProjectsAsync() 
    : projectsClient.listProjectsAsync({ parent: organizationName })
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
    throw new Error('Project create not implemented.')
  }
  else {
    const project = projectData.find(({ displayName }) => displayName === projectDisplayName)
    projectName = project.name
    const projectId = project.projectId

    config.projectName = projectName

    return { projectDisplayName, projectId, projectName }
  }
}

export { selectProject }