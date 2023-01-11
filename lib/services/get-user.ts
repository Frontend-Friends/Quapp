import { getDoc } from 'firebase/firestore'
import { getUserRef } from '../helpers/refs/get-user-ref'
import { User } from '../../components/user/types'

export const getUser = async (userId: string) => {
  const [ref] = getUserRef(userId)
  return Promise.all([
    await getDoc(ref).then(
      (r) =>
        ({
          ...r.data(),
          id: r.id,
        } as User)
    ),
    ref,
  ])
}
