import { Button, Card } from '@mui/material'
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

    return dayjs(date).format('DD.MM. HH:MM')
  }, [message])

  return (
    <Link href={href} passHref shallow>
      <Card component={Button} className="flex w-full gap-4 p-4">
        <span className="text-gray-500">{dateFormate}</span>
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
