import { Message } from '../components/message/type'
import { ProductType } from '../components/products/types'
import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { useMemo } from 'react'

export const useFetchBorrowRequestMessage: (message: Message | undefined) => [
  message: {
    ok?: boolean
    userName?: string
    product?: ProductType | null
  },
  loading?: boolean
] = (message) => {
  const fetchedData = useAsync(async () => {
    if (!message) {
      return {}
    }
    const data = await fetchJson<{
      ok: boolean
      userName: string
      product: ProductType | null
    }>(`/api/borrow-request-message`, {
      method: 'POST',
      body: JSON.stringify({
        userId: message.requesterId,
        productId: message.productId,
        space: message.space,
      }),
    })
    if (!data.ok) {
      return {}
    }
    return data || {}
  }, [message])

  return useMemo(
    () => [fetchedData.value || {}, fetchedData.loading || false],
    [fetchedData]
  )
}
