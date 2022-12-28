import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductFormData } from '../../components/products/types'
import { User } from '../../components/user/types'
import { getUserRef } from '../helpers/refs/get-user-ref'

export const createProduct = async (
  user: User,
  fields: Pick<ProductFormData, 'fields'>,
  imgSrc: string | null
) => {
  const docRef = collection(db, 'spaces', user?.spaces?.[0] ?? '', 'products')

  const userRef = user.id ? getUserRef(user.id) : ''

  await addDoc(docRef, {
    ...fields,
    imgSrc,
    isAvailable: true,
    owner: userRef,
  })
}
