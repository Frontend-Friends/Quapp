import { getUserRef } from '../../lib/helpers/refs/get-user-ref'
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { Message } from '../../components/message/type'
import { useRouter } from 'next/router'
import { UseTranslationType } from '../../hooks/use-translation'

const unreadMessages: Message[] = []

type RouterType = ReturnType<typeof useRouter>

export function messageListener(
  userId: string,
  push: RouterType['push'],
  t: UseTranslationType,
  allowNotifications: boolean
) {
  const [, userPath] = getUserRef(userId)
  const messageCollection = collection(...userPath, 'messages')
  const q = query(messageCollection, where('read', '==', false))
  return onSnapshot(q, (docs) => {
    const messages = docs.docs.map(
      (doc) =>
        ({
          id: doc.id,
          date: doc.id,
          ...doc.data(),
        } as DocumentData)
    )
    messages.forEach((message) => {
      const mayHasMessage = unreadMessages.some(
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
  })
}
