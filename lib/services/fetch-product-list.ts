import {
  collection,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductType } from '../../components/products/types'
import { User } from '../../components/user/types'
import { pageLimit } from '../../pages/community/[space]/products/[[...products]]'

export const fetchProductList = async (
  space: string,
  skip?: number,
  filter?: number
) => {
  const productCollection = collection(db, 'spaces', space, 'products')

  const limited = pageLimit

  const offset = pageLimit * (skip || 0)

  const firstProductQuery =
    filter !== undefined
      ? query(
          productCollection,
          where('category', '==', filter),
          orderBy('createdAt'),
          limit(offset || limited)
        )
      : query(productCollection, orderBy('createdAt'), limit(offset || limited))

  const countQuery =
    filter !== undefined
      ? query(
          productCollection,
          where('category', '==', filter),
          orderBy('createdAt')
        )
      : query(productCollection, orderBy('createdAt'))

  const firstProducts = await getDocs(firstProductQuery)

  const productCount = await getDocs(countQuery)

  const lastIndex = firstProducts.docs.length - 1

  const lastProductRef = firstProducts.docs[lastIndex]

  const productsData: DocumentData[] = []

  const productQuery =
    filter !== undefined
      ? query(
          productCollection,
          where('category', '==', filter),
          orderBy('createdAt'),
          startAfter(lastProductRef),
          limit(limited)
        )
      : query(
          productCollection,
          orderBy('createdAt'),
          startAfter(lastProductRef),
          limit(limited)
        )

  const skippedProducts = await getDocs(productQuery)

  const productSnapshot = skip ? skippedProducts : firstProducts

  productSnapshot.forEach((productDoc) => {
    const docData = productDoc.data()
    productsData.push({
      ...docData,
      id: productDoc.id,
    })
  })

  const products = await Promise.all(
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

  products.sort((a, b) => {
    if (!a.createdAt) {
      return 1
    }
    if (!b.createdAt) {
      return -1
    }
    return a.createdAt > b.createdAt ? -1 : 1
  })

  return {
    products: products as ProductType[],
    count: productCount.docs.length,
  }
}
