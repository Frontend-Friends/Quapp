import { fetchJson } from '../helpers/fetch-json'
import { ProductType } from '../../components/products/types'

export const fetchProduct = async (
  space: string,
  productsQuery: string,
  userId?: string
) => {
  const { product } = await fetchJson<{ product: ProductType }>(
    `https://us-central1-quapp-dff48.cloudfunctions.net/product?space=${space}&productId=${productsQuery}&userId=${userId}`
  )
  return product
}
