import { ProductType } from '../components/products/types'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'

export const fetchProduct = async (productId: string, space: string) => {
  return fetchJson<ProductType>(
    `/api/product?productId=${productId}&space=${space}`
  )
}
export const deleteProduct = async (productId: string, space: string) => {
  return fetchJson<ProductType>(
    `/api/delete-product?productId=${productId}&space=${space}`
  )
}

export const useFetchProductDetail = (
  initialProductDetail?: ProductType | null
) => {
  const { query } = useRouter()
  const { products: productQuery, space } = query
  const isInitial = useRef(true)
  const currentQuery = useRef(productQuery?.[0])
  const [product, setProduct] = useState(initialProductDetail)
  useAsync(async () => {
    if (
      !!productQuery?.[0] &&
      !isInitial.current &&
      currentQuery.current !== productQuery[0]
    ) {
      const fetchedProduct = await fetchProduct(
        productQuery[0],
        space as string
      )
      setProduct(fetchedProduct)
    }
    if (!productQuery?.[0]) {
      setProduct(null)
    }
    isInitial.current = false
    currentQuery.current = productQuery?.[0]
  }, [productQuery])

  return product
}
