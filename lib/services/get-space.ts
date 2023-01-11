import { getDoc } from 'firebase/firestore'
import { SpaceItemType } from '../../components/products/types'
import { getSpaceRef } from '../helpers/refs/get-space-ref'

export const getSpace = async (spaceId: string) => {
  const [ref] = getSpaceRef(spaceId)
  return Promise.all([
    await getDoc(ref).then(
      (r) =>
        ({
          ...r.data(),
          id: r.id,
        } as SpaceItemType)
    ),
    ref,
  ])
}
