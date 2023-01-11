import {
  collection,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductType } from '../../components/products/types'
import { User } from '../../components/user/types'
import { getSpace } from './get-space'
import { getUserRef } from '../helpers/refs/get-user-ref'

export const fetchMyProductList = async (space: string, userId: string) => {
  const productCollection = collection(db, 'spaces', space, 'products')

  const [userRef] = getUserRef(userId)

  const productQuery = query(
    productCollection,
    where('owner', '==', userRef),
    orderBy('createdAt')
  )

  const fetchedProducts = await getDocs(productQuery)

  const [fetchedSpace] = await getSpace(space)

  const productsData = fetchedProducts.docs.map((productDoc) => {
    const docData = productDoc.data()
    return {
      ...docData,
      id: productDoc.id,
      spaceId: fetchedSpace.id,
      spaceName: fetchedSpace.name,
    } as DocumentData
  })

  // get The owner of the product by the user
  return Promise.all(
    productsData.map(async (product) => {
      const user = await getDoc<User>(product.owner).then((r) => ({
        ...r.data(),
        id: r.id,
      }))
      return {
        ...product,
        owner: { userName: user.userName || null, id: user.id || null },
      } as unknown as ProductType
    })
  )
}
