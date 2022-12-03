import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { User } from '../../components/user/types'

export const fetchUser = async (uid: string): Promise<User> => {
  const docRef = doc(db, 'user', uid)
  return getDoc(docRef).then(
    (result) =>
      ({
        id: result.id,
        ...result.data(),
      } as User)
  )
}
