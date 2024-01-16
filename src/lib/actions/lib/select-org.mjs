import { Questioner } from '@liquid-labs/question-and-answer'
import { OrganizationsClient } from '@google-cloud/resource-manager'

import { CREATE_LABEL, NONE_LABEL } from './constants'

const selectOrg = async({ allowNone = false, config, requireDisplayName = false }) => {
  const orgClient = new OrganizationsClient()

  let { organizationName } = config

  let organizationDisplayName
  if (organizationName !== undefined) {
    if (requireDisplayName === true) {
      const [organization] = await orgClient.getOrganization({ name : organizationName })
      organizationDisplayName = organization.displayName
    }

    return { organizationDisplayName, organizationName }
  }
  // else, we select the org
  const organizations = await orgClient.searchOrganizationsAsync()
  const organizationOptions = []
  const organizationsData = []

  for await (const organization of organizations) {
    organizationOptions.push(organization.displayName)
    organizationsData.push(organization)
  }

  if (allowNone === true) {
    organizationOptions.push(NONE_LABEL)
  }
  organizationOptions.push(CREATE_LABEL)
  const organizationIB = {
    actions : [
      { prompt : 'Select an organization to use:', options : organizationOptions, parameter : 'ORG_NAME' }
    ]
  }

  const orgQuestioner = new Questioner({ interrogationBundle : organizationIB })
  await orgQuestioner.question()

  organizationDisplayName = orgQuestioner.get('ORG_NAME')
  if (organizationDisplayName === NONE_LABEL) {
    delete config.organizationName

    return null
  }
  else if (organizationDisplayName === CREATE_LABEL) {
    throw new Error('Organization create not implemented.')
  }
  else { // they selected an existing org
    organizationName = organizationsData.find(({ displayName }) => displayName === organizationDisplayName).name
    config.organizationName = organizationName

    return { organizationDisplayName, organizationName }
  }
}

export { selectOrg }
