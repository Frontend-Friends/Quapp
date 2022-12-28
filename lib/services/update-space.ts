import { setDoc } from 'firebase/firestore'
import { SpaceItemType } from '../../components/products/types'
import { deleteObjectKey } from '../helpers/delete-object-key'
import { getSpaceRef } from '../helpers/refs/get-space-ref'

export const updateSpace = async (space: string, values: SpaceItemType) => {
  const [spaceRef] = getSpaceRef(space as string)

  deleteObjectKey(values, 'id')

  return setDoc(spaceRef, values, { merge: true }).then((value) => value)
}
