import { getSpaceRef } from './refs/get-space-ref'
import { deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import { SpaceItemType } from '../../components/products/types'

export const assignNewOwner = async (spaceId: string, userId: string) => {
  const [spaceRef] = getSpaceRef(spaceId)
  await getDoc(spaceRef).then(async (res) => {
    const resData = res.data() as SpaceItemType
    const newOwner = resData?.users?.find((id) => id !== userId)
    if (newOwner) {
      await updateDoc(spaceRef, {
        ownerId: `/user/${newOwner}`,
      })
    } else {
      // space has only one user (the logged-in user), delete the space
      await deleteDoc(spaceRef)
    }
  })
}
