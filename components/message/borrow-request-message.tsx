import { Message } from './type'
import { useCallback, useMemo, useState } from 'react'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useTranslation } from '../../hooks/use-translation'
import dayjs from 'dayjs'
import Link from 'next/link'
import { LoadingButton } from '@mui/lab'

export const BorrowRequestMessage = ({
  message,
  updateMessage,
}: {
  message: Message
  updateMessage: (message: Message) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleRequest = useCallback(
    async (accept: boolean) => {
      setIsLoading(true)
      const fetchedData = await fetchJson<{ ok: boolean }>(
        `/api/borrow-response`,
        {
          method: 'POST',
          body: JSON.stringify({
            messageId: message.date,
            productId: message.productId,
            accept,
            requesterId: message.requesterId,
            space: message.space,
            date: message.borrowDate,
          }),
        }
      )
      if (fetchedData.ok) {
        updateMessage({
          ...message,
          status: 'replied',
          accept,
        })
      }
      setIsLoading(false)
    },
    [message, updateMessage]
  )

  const t = useTranslation()
  const borrowText = useMemo(() => {
    return t('BORROW_request_text')
      .replace('{USER}', `<span class="font-black">${message.userName}</span>`)
      .replace(
        '{DATE}',
        `<span class="font-black">${dayjs(message?.borrowDate).format(
          'DD.MM.YYYY'
        )}</span>`
      )
      .replace(
        '{PRODUCT_TITLE}',
        `<span class="font-black">"${message.product?.title}"</span>`
      )
  }, [t, message])
  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: borrowText }} />
      <Link
        href={`/community/${message.space}/products/${message.productId}`}
        passHref
      >
        <a>{t('REQUEST_product_link')}</a>
      </Link>
      {message.status === 'pending' && (
        <div className="mt-4 flex gap-4">
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            className="flex-grow"
            onClick={async () => {
              if (handleRequest) {
                await handleRequest(false)
              }
            }}
          >
            {t('REQUEST_decline')}
          </LoadingButton>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            className="flex-grow"
            onClick={async () => {
              if (handleRequest) {
                await handleRequest(true)
              }
            }}
          >
            {t('REQUEST_accept')}
          </LoadingButton>
        </div>
      )}
      {message.status === 'replied' && (
        <div className="mt-4 font-black">
          {t(
            message.accept
              ? 'BORROW_response_accept_text'
              : 'BORROW_response_declined_text'
          )}
        </div>
      )}
    </div>
  )
}
