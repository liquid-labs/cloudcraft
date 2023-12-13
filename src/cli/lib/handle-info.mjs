import { info } from '../../lib/actions'

const handleInfo = async({ argv }) => {
  await info({})
}

export { handleInfo }
