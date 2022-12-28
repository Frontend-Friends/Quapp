import { Message } from './type'
import { useMemo } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import dayjs from 'dayjs'
import Link from 'next/link'
import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import CheckIcon from '@mui/icons-material/Check'

export const BorrowResponseMessage = ({ message }: { message: Message }) => {
  const t = useTranslation()
  const borrowText = useMemo(() => {
    return t('BORROW_response_text')
      .replace('{USER}', `<span class="font-black">${message.userName}</span>`)
      .replace(
        '{ACCEPT}',
        message.accept
          ? ''
          : `<span class="font-black text-violetRed-600">${t(
              'BORROW_response_not'
            )}</span>`
      )
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
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-lg text-white',
            message.accept ? 'bg-mintGreen-900' : 'bg-violetRed-600'
          )}
        >
          {!message.accept ? <CloseIcon /> : <CheckIcon />}
        </div>

        <p dangerouslySetInnerHTML={{ __html: borrowText }} />
      </div>
      <Link
        href={`/community/${message.space}/products/${message.productId}`}
        passHref
      >
        <a>{t('REQUEST_product_link')}</a>
      </Link>
    </div>
  )
}
