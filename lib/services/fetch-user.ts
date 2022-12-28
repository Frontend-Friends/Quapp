import { getDoc } from 'firebase/firestore'
import { User } from '../../components/user/types'
import { getUserRef } from '../helpers/refs/get-user-ref'

export const fetchUser = async (uid: string): Promise<User> => {
  const [docRef] = getUserRef(uid)
  return getDoc(docRef).then(
    (result) =>
      ({
        id: result.id,
        ...result.data(),
      } as User)
  )
}
