import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { useTranslation } from '../hooks/use-translation'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { messageListener } from '../lib/services/message-listener'
import { User } from './user/types'
import { useUnreadMessages } from '../hooks/use-unread-messages'
import { Message } from './message/type'

export const Notifications = () => {
  const t = useTranslation()
  const { push } = useRouter()
  const [userId, setUserId] = useState('')
  const unreadMessages = useRef<Message[]>([])
  const setMessages = useUnreadMessages((state) => state.setMessages)
  const allowNotifications = useRef(false)
  const [incomingMessage, setIncomingMessage] = useState<Message[]>([])

  useAsync(async () => {
    const { user, ok } = await fetchJson<{ user: User }>('/api/user')
    if (ok) {
      setUserId(user.id || '')
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      return
    }
    try {
      Notification.requestPermission().then((permission) => {
        allowNotifications.current = permission === 'granted'
      })
    } catch (err) {
      console.log(err)
    }
    const unsubscribe = messageListener(userId, push, t, setIncomingMessage)

    return () => {
      unsubscribe()
    }
  }, [push, t, userId])

  useEffect(() => {
    incomingMessage.forEach((message) => {
      const mayHasMessage = unreadMessages.current.some(
        (item) => message.id === item.id
      )
      if (!mayHasMessage && allowNotifications) {
        try {
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
        } catch (err) {
          console.log(err)
        }
        setMessages([...incomingMessage])
      }
    })
  }, [incomingMessage, push, setMessages, t])

  return null
}
