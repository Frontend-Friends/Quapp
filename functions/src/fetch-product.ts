import { getRef } from './get-ref'
import { app } from './admin'
import { DocumentData } from 'firebase-admin/firestore'

export const fetchProduct = async (productId: string, space: string) => {
  const ref = getRef('spaces', space, 'products', productId)
  return Promise.all([
    await app
      .firestore()
      .doc(ref)
      .get()
      .then(
        (r) =>
          ({
            ...r.data(),
            id: r.id,
          } as DocumentData)
      ),
    ref,
  ])
}
