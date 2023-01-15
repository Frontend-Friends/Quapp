import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { Message } from './message/type'
import { useTranslation } from '../hooks/use-translation'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useUnreadMessages } from '../hooks/use-unread-messages'

export const Notifications = () => {
  const t = useTranslation()
  const [request, setRequest] = useState(0)
  const unreadMessages = useRef<Message[]>([])
  const { push } = useRouter()
  const { asPath } = useRouter()
  const { setMessages } = useUnreadMessages()

  useAsync(async () => {
    let allowNotifications = false
    Notification.requestPermission().then((permission) => {
      allowNotifications = permission === 'granted'
    })
    if (
      (!asPath.startsWith('/community') && !asPath.startsWith('/user')) ||
      asPath.startsWith('/user/inbox')
    ) {
      return
    }
    const { messages } = await fetchJson<{ messages: Message[] }>(
      '/api/unread-messages'
    )

    messages.forEach((message) => {
      const mayHasMessage = unreadMessages.current.some(
        (item) => message.id === item.id
      )
      if (!mayHasMessage && allowNotifications) {
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
    setMessages(unreadMessages.current)
    const delay = setTimeout(() => {
      setRequest(request + 1)
    }, 120000) // 2 Min

    return () => {
      clearTimeout(delay)
    }
  }, [request, setMessages])
  return null
}
