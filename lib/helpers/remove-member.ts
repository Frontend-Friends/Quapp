import { getSpaceRef } from './refs/get-space-ref'
import { getUserRef } from './refs/get-user-ref'
import {
  arrayRemove,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getProductRef } from './refs/get-product-ref'

export const removeMember = async ({
  space,
  userId,
}: {
  space: string
  userId: string
}) => {
  const [spaceRef, spacePath] = getSpaceRef(space)
  const [userRef] = getUserRef(userId)
  const productsRef = collection(...spacePath, 'products')
  const q = query(productsRef, where('owner', '==', userRef))

  const products = await getDocs(q)

  await Promise.all(
    products.docs.map(
      (entry) =>
        new Promise(async (resolve) => {
          const [productRef] = getProductRef(space, entry.id)
          await deleteDoc(productRef)
          resolve(true)
        })
    )
  )
  await Promise.all([
    updateDoc(userRef, {
      spaces: arrayRemove(space),
    }),
    updateDoc(spaceRef, {
      users: arrayRemove(userId),
    }),
  ])
}
