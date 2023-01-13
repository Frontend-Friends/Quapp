import {
  collection,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductType } from '../../components/products/types'
import { User } from '../../components/user/types'
import { maxProductsPerPage } from '../../pages/community/[space]/products/[[...products]]'
import { getSpace } from './get-space'

export const fetchProductList = async (
  space: string,
  skip?: number,
  filter?: number
) => {
  const productCollection = collection(db, 'spaces', space, 'products')

  const orderByDate = orderBy('createdAt', 'desc')
  const filterQuery = where('category', '==', filter)

  // Query to count all the products
  const countQuery =
    filter !== undefined
      ? query(productCollection, filterQuery, orderByDate)
      : query(productCollection, orderByDate)

  // fetch the products to count
  const productCountDocs = await getDocs(countQuery)

  // get the numbers of products
  const productCount = productCountDocs.docs.length

  const maxPages = Math.floor(productCount / maxProductsPerPage)

  // If skip exists and skip is bigger than maxPages, return maxPages
  // If skip does not exist return 0
  const offsetMultiplier = skip && skip > maxPages ? maxPages : skip || 0

  const offset = maxProductsPerPage * offsetMultiplier

  // make sure we always have a number
  const maxProducts = maxProductsPerPage + maxProductsPerPage * offsetMultiplier

  const limited = limit(maxProducts)

  // Query to get all Products from 0 to current page with or without filter
  const firstProductQuery =
    filter !== undefined
      ? query(productCollection, filterQuery, orderByDate, limited)
      : query(productCollection, orderByDate, limited)

  // get the products
  const firstProducts = await getDocs(firstProductQuery)

  // remove all products except the ones on the current page
  const productsOnPage = firstProducts.docs.slice(offset)
  const productsData: DocumentData[] = []

  const [fetchedSpace] = await getSpace(space)

  productsOnPage.forEach((productDoc) => {
    const docData = productDoc.data()
    productsData.push({
      ...docData,
      id: productDoc.id,
      spaceId: fetchedSpace.id,
      spaceName: fetchedSpace.name,
    })
  })

  // get The owner of the product by the user
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

  return {
    products: products as ProductType[],
    count: productCount,
  }
}
