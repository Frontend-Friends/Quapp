import { getUserRef } from './refs/get-user-ref'
import { deleteDoc } from 'firebase/firestore'

export const deleteUserFromFirestore = async ({
  userId,
}: {
  userId: string
}) => {
  const [userRef] = getUserRef(userId)
  await deleteDoc(userRef)
}
