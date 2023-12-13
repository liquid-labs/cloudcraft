import { list } from '../../lib/actions'

const handleList = async({ argv }) => {
  await list({})
}

export { handleList }
