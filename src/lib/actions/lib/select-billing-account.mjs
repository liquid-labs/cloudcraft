import { Questioner } from '@liquid-labs/question-and-answer'
import { CloudBillingClient } from '@google-cloud/billing'

import { CREATE_LABEL } from './constants'

const selectBillingAccount = async({ config, requireDisplayName = false }) => {
  const billingAccountClient = new CloudBillingClient()

  let { billingAccountName } = config

  let billingAccountDisplayName
  if (billingAccountName !== undefined) {
    if (requireDisplayName === true) {
      const [billingAccount] = await selectBillingAccount.getBillingAccount({ name : billingAccountName })
      billingAccountDisplayName = billingAccount.displayName
    }

    return { billingAccountDisplayName, billingAccountName }
  }
  // else, we select the org
  const billingAccounts = billingAccountClient.listBillingAccountsAsync()
  const billingAccountOptions = []
  const billingAccountsData = []

  for await (const billingAccount of billingAccounts) {
    billingAccountOptions.push(billingAccount.displayName)
    billingAccountsData.push(billingAccount)
  }

  billingAccountOptions.push(CREATE_LABEL)
  const billingAccountIB = {
    actions : [
      {
        prompt    : 'Select a billing account to use:',
        options   : billingAccountOptions,
        parameter : 'BILLING_ACCOUNT_NAME'
      }
    ]
  }

  const billingAccountQuestioner = new Questioner({ interrogationBundle : billingAccountIB })
  await billingAccountQuestioner.question()

  billingAccountDisplayName = billingAccountQuestioner.get('BILLING_ACCOUNT_NAME')
  if (billingAccountDisplayName === CREATE_LABEL) {
    throw new Error('Billing account create not implemented.')
  }
  else { // they selected an existing billing account
    billingAccountName = billingAccountsData.find(({ displayName }) => displayName === billingAccountDisplayName).name
    config.billingAccountName = billingAccountName

    return { billingAccountDisplayName, billingAccountName }
  }
}

export { selectBillingAccount }
