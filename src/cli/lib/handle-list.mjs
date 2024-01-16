import { list } from '../../lib/actions'

const handleList = async({ argv, quiet }) => {
  await list({ quiet })
}

export { handleList }
