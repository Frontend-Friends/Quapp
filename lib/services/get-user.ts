import { getDoc } from 'firebase/firestore'
import { ProductType } from '../../components/products/types'
import { getUserRef } from '../helpers/refs/get-user-ref'

export const getUser = async (userId: string) => {
  const [ref] = getUserRef(userId)
  return Promise.all([
    await getDoc(ref).then(
      (r) =>
        ({
          ...r.data(),
          id: r.id,
        } as ProductType)
    ),
    ref,
  ])
}
