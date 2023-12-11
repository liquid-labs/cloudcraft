import { Storage } from '@google-cloud/storage'
import { Questioner } from '@liquid-labs/question-and-answer'

import { CREATE_LABEL } from './constants'

const selectBucket = async({ config, projectId }) => {
  const storageClient = new Storage({ projectId })

  let { bucketName } = config

  if (bucketName !== undefined) {
    return bucketName
  }

  const [buckets] = await storageClient.getBuckets()
  const bucketOptions = buckets.map(({ name }) => name)

  bucketOptions.push(CREATE_LABEL)
  const bucketsIB = {
    actions : [
      { prompt : 'Select a bucket to use for terraform state:', options : bucketOptions, parameter : 'BUCKET_NAME' }
    ]
  }

  const bucketQuestioner = new Questioner({ interrogationBundle : bucketsIB })
  await bucketQuestioner.question()

  bucketName = bucketQuestioner.get('BUCKET_NAME')

  if (bucketName === CREATE_LABEL) {
    throw new Error('Bucket create not implemented.')
  }
  else {
    config.bucketName = bucketName

    return bucketName
  }
}

export { selectBucket }
