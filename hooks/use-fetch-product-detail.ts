import { ProductType } from '../components/products/types'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { fetchProductApi } from '../lib/helpers/fetch-product-api'

export const deleteProduct = async (productId: string, space: string) => {
  return fetchJson<ProductType>(
    `/api/delete-product?productId=${productId}&space=${space}`,
    { method: 'DELETE' }
  )
}

export const useFetchProductDetail = (
  initialProductDetail?: ProductType | null,
  space?: string | null
) => {
  const { query } = useRouter()
  const { products: productQuery } = query
  const isInitial = useRef(true)
  const currentQuery = useRef(productQuery?.[0])
  const [product, setProduct] = useState(initialProductDetail)
  useAsync(async () => {
    if (!space) {
      return
    }
    if (
      !!productQuery?.[0] &&
      !isInitial.current &&
      currentQuery.current !== productQuery[0]
    ) {
      const fetchedProduct = await fetchProductApi(space, productQuery[0])
      setProduct(fetchedProduct)
    }
    if (!productQuery?.[0]) {
      setProduct(null)
    }
    isInitial.current = false
    currentQuery.current = productQuery?.[0]
  }, [productQuery, space])

  return product
}
