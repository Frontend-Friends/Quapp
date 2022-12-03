import { addDoc, collection, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductFormData } from '../../components/products/types'
import { User } from '../../components/user/types'

export const createProduct = async (
  user: User,
  fields: Pick<ProductFormData, 'fields'>,
  imgSrc: string | null
) => {
  const docRef = collection(db, 'spaces', user.spaces[0], 'products')

  const userRef = doc(db, 'user', user.uid)

  await addDoc(docRef, {
    ...fields,
    imgSrc,
    isAvailable: true,
    owner: userRef,
  })
}
