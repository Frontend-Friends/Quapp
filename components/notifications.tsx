import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { Message } from './message/type'
import { useTranslation } from '../hooks/use-translation'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useUnreadMessages } from '../hooks/use-unread-messages'
import Cookies from 'js-cookie'

export const Notifications = () => {
  const t = useTranslation()
  const [request, setRequest] = useState(0)
  const unreadMessages = useRef<Message[]>([])
  const { push } = useRouter()
  const { asPath } = useRouter()
  const { setMessages } = useUnreadMessages()

  useAsync(async () => {
    const notificationCookie = Cookies.get('allowNotification')
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted' && notificationCookie !== 'true') {
        Cookies.set('allowNotification', 'true')
      } else if (notificationCookie !== 'false') {
        Cookies.set('allowNotification', 'false')
      }
    })
    if (asPath.startsWith('/user/inbox')) {
      return
    }
    const { messages } = await fetchJson<{ messages: Message[] }>(
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
    setMessages(unreadMessages.current)
    const delay = setTimeout(() => {
      setRequest(request + 1)
    }, 5000)

    return () => {
      clearTimeout(delay)
    }
  }, [request, setMessages])
  return null
}
