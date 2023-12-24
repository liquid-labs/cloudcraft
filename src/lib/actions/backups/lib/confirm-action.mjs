import { Questioner } from '@liquid-labs/question-and-answer'

const confirmAction = async ({ actionDescription, confirm }) => {
  if (confirm === true) {
    return true
  }
  else if (confirm === false) {
    throwCancellation({ actionDescription })
  }
  else {
    const interrogationBundle = {
      actions : [
        {
          prompt    : `Confirm ${actionDescription}:`,
          parameter : 'CONFIRM',
          paramType : 'boolean'
        }
      ]
    }
    const questioner = new Questioner({ interrogationBundle })
    await questioner.question()

    confirm = questioner.get('CONFIRM')
    if (confirm === true) {
      return true
    }
    else {
      throwCancellation({ actionDescription })
    }
  }
}

const throwCancellation = ({ actionDescription }) => {
  actionDescription = actionDescription.charAt(0).toUpperCase() + actionDescription.slice(1)
  throw new Error(actionDescription + ' cancelled.')
}

export { confirmAction }