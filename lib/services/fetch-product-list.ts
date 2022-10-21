import { collection, DocumentData, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductType } from '../../components/products/types'

export const fetchProductList = async () => {
  const productCollection = collection(db, 'products')

  const productSnapshot = await getDocs(productCollection)

  const productsData: DocumentData[] = []

  productSnapshot.forEach((productDoc) => {
    const docData = productDoc.data()
    productsData.push({
      ...docData,
      owner: docData.owner.id,
      id: productDoc.id,
    })
  })

  return productsData as ProductType[]
}
