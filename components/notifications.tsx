import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { Message } from './message/type'
import { useTranslation } from '../hooks/use-translation'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'

export const Notifications = () => {
  const t = useTranslation()
  const [request, setRequest] = useState(0)
  const unreadMessages = useRef<Message[]>([])
  const { push } = useRouter()
  const { asPath } = useRouter()

  useAsync(async () => {
    if (asPath.startsWith('/user/inbox')) {
      return
    }
    const { messages } = await fetchJson<{ messages: Message[]; ok: boolean }>(
      '/api/unread-messages'
    )

    messages.forEach((message) => {
      const mayHasMessage = unreadMessages.current.some(
        (item) => message.id === item.id
      )
      if (!mayHasMessage) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            const notification = new Notification(
              t('NOTIFICATION_unread_message'),
              {
                body: message.message,
                tag: message.id,
                icon: '/favicon-32x32.png',
              }
            )
            notification.addEventListener('click', () => {
              push(`/user/inbox/${message.id}`)
            })
          }
        })
      }
    })
    unreadMessages.current.push(...messages)
    const delay = setTimeout(() => {
      setRequest(request + 1)
    }, 5000)

    return () => {
      clearTimeout(delay)
    }
  }, [request])
  return null
}
