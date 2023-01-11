import { Message } from './type'
import { useCallback, useMemo, useState } from 'react'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useTranslation } from '../../hooks/use-translation'
import Alert from '@mui/material/Alert'
import dayjs from 'dayjs'
import Link from 'next/link'
import { LoadingButton } from '@mui/lab'
import { Divider } from '@mui/material'

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
      const fetchedData = await fetchJson(`/api/borrow-response`, {
        method: 'POST',
        body: JSON.stringify({
          messageId: message.date,
          productId: message.productId,
          accept,
          requesterId: message.requesterId,
          space: message.space,
          date: message.borrowDate,
        }),
      })
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

  let inquiryStatus

  if (message.accept) {
    inquiryStatus = (
      <Alert severity="error">{t('BORROW_response_declined_text')}</Alert>
    )
  } else {
    inquiryStatus = (
      <Alert severity="success">{t('BORROW_response_accept_text')}</Alert>
    )
  }

  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: borrowText }} />
      <Link
        href={`/community/${message.space}/products/${message.productId}`}
        passHref
      >
        <a className="inline-block rounded bg-violetRed-600 py-1 px-4 text-white no-underline hover:bg-mintGreen-600">
          {t('REQUEST_product_link')}
        </a>
      </Link>
      <Divider className="my-6" />
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
      {message.status === 'replied' && inquiryStatus}
    </>
  )
}
