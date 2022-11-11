import { ProductType } from '../components/products/types'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'

export const useFetchProductDetail = (
  initialProdcutDetail: ProductType | null
) => {
  const { query } = useRouter()
  const { products: productQuery } = query
  const isInitial = useRef(true)
  const currentQuery = useRef(productQuery?.[0])
  const [product, setProduct] = useState(initialProdcutDetail)
  useAsync(async () => {
    if (
      !!productQuery?.[0] &&
      !isInitial.current &&
      currentQuery.current !== productQuery[0]
    ) {
      const fetchedProduct = await fetchJson<ProductType>(
        `/api/product?productId=${productQuery[0]}`
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
