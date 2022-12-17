import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export const getProduct = async (productId: string, space: string) => {
  const productRef = doc(db, 'spaces', space, 'products', productId)
  return Promise.all([
    await getDoc(productRef).then(
      (r) =>
        ({
          ...r.data(),
          id: r.id,
        } as DocumentData)
    ),
    productRef,
  ])
}
