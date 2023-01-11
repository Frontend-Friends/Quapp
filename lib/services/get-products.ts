import { fetchJson } from '../helpers/fetch-json'
import { ProductType } from '../../components/products/types'

export const getProducts = async (
  space: string,
  skip?: string,
  filter?: string
) => {
  const filterNumber = parseInt(filter || '')
  const filterQuery = isNaN(filterNumber) ? '' : `&filter=${filterNumber}`
  const skipQuery = skip === undefined ? '' : `&skip=${skip}`
  return fetchJson<{
    products: ProductType[]
    count: number
  }>(`/api/product-list?space=${space}${skipQuery}${filterQuery}`)
}
