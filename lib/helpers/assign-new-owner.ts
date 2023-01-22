import { getSpaceRef } from './refs/get-space-ref'
import { deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import { SpaceItemType } from '../../components/products/types'

export const assignNewOwner = async (
  spaceId: string,
  userId: string
): Promise<void> => {
  const [spaceRef] = getSpaceRef(spaceId)
  const res = await getDoc(spaceRef)
  const spaceData = res.data() as SpaceItemType
  const isOwnSpace = spaceData?.ownerId === userId
  if (isOwnSpace) {
    const newOwner = spaceData?.users?.find((id) => id !== userId)
    if (newOwner) {
      await updateDoc(spaceRef, {
        ownerId: `/user/${newOwner}`,
      })
    } else {
      // space has only one user (the logged-in user), delete the space
      await deleteDoc(spaceRef)
    }
  }
}
