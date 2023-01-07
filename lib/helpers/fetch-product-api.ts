import { fetchJson } from './fetch-json'
import { ProductType } from '../../components/products/types'

export const fetchProductApi = async (space: string, productId: string) =>
  fetchJson<ProductType>(`/api/product?space=${space}&productId=${productId}`)
