import { getDoc } from 'firebase/firestore'
import { getProductRef } from '../helpers/refs/get-product-ref'
import { ProductType } from '../../components/products/types'

export const getProduct = async (productId: string, space: string) => {
  const [ref] = getProductRef(space, productId)
  return Promise.all([
    await getDoc(ref).then(
      (r) =>
        ({
          ...r.data(),
          id: r.id,
        } as ProductType)
    ),
    ref,
  ])
}
