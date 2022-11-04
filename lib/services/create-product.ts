import { addDoc, collection, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductFormData } from '../../components/products/types'

export const createProduct = async (
  user: any,
  fields: Pick<ProductFormData, 'fields'>,
  imgSrc: string | null
) => {
  const docRef = collection(db, 'spaces', user.spaces[0], 'products')

  const userRef = doc(db, 'user', user.id)

  await addDoc(docRef, {
    ...fields,
    imgSrc,
    isAvailable: true,
    owner: userRef,
  })
}
