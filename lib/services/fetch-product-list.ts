import { collection, DocumentData, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductType } from '../../components/products/types'
import { User } from '../../components/user/types'

export const fetchProductList = async (space: string) => {
  const productCollection = collection(db, 'spaces', space, 'products')

  const productSnapshot = await getDocs(productCollection)

  const productsData: DocumentData[] = []

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

  return products as ProductType[]
}
