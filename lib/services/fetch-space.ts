import { getDoc } from 'firebase/firestore'
import { SpaceItemType } from '../../components/products/types'
import { getSpaceRef } from '../helpers/refs/get-space-ref'

export const fetchSpace = async (space: string) => {
  const [spaceRef] = getSpaceRef(space as string)

  return getDoc(spaceRef).then((r) => ({
    id: r.id,
    ...r.data(),
  })) as Promise<SpaceItemType>
}
