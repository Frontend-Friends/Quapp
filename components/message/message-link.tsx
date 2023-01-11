import { Card } from '@mui/material'
import Link from 'next/link'
import { Message } from './type'
import { useTranslation } from '../../hooks/use-translation'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Url } from 'url'

export const MessageLink = ({
  message,
  href,
}: {
  message: Message
  href: Partial<Url>
}) => {
  const t = useTranslation()
  const dateFormate = useMemo(() => {
    const date = new Date(parseInt(message.date))

    return dayjs(date).format('DD.MM.YY - HH:MM')
  }, [message])

  return (
    <Link href={href} passHref shallow>
      <Card className="flex w-full items-center gap-4 bg-blueishGray-50 p-4 hover:cursor-pointer hover:bg-white">
        <span className="w-[110px] shrink-0 rounded bg-blueishGray-200 py-1 px-2 text-center text-xs text-white md:w-[140px]">
          {dateFormate}
        </span>
        <span>
          {message.type === 'borrowRequest' && t('BORROW_message_title')}
          {message.type === 'borrowResponse' &&
            t('BORROW_message_response_title')}
          {message.product && message.product.title}
        </span>
        {!message.read && (
          <span className="block h-2 w-2 rounded-full bg-violetRed-600" />
        )}
      </Card>
    </Link>
  )
}
