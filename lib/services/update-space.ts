import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { SpaceItemType } from '../../components/products/types'
import { deleteObjectKey } from '../helpers/delete-object-key'

export const updateSpace = async (space: string, values: SpaceItemType) => {
  const spaceRef = doc(db, 'spaces', space as string)

  deleteObjectKey(values, 'id')

  return setDoc(spaceRef, values, { merge: true }).then((value) => value)
}
