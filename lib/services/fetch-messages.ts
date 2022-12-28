import { collection, getDocs } from 'firebase/firestore'
import { Message } from '../../components/message/type'
import { fetchProduct } from './fetch-product'
import { fetchUser } from './fetch-user'
import { getUserRef } from '../helpers/refs/get-user-ref'

export const fetchMessages = async (userId: string) => {
  const [, userPath] = getUserRef(userId)
  const messageCollection = collection(...userPath, 'messages')

  const messagesRef = await getDocs(messageCollection)

  const messages = await Promise.all<Message>(
    messagesRef.docs.map(
      (item) =>
        new Promise(async (resolve) => {
          const message = {
            id: item.id,
            date: item.id,
            ...item.data(),
          } as Message

          const product =
            message.type === 'borrowRequest'
              ? await fetchProduct(message.space, message.productId)
              : null

          const requester = await fetchUser(message.requesterId)
          return resolve({
            ...message,
            userName: requester.userName || '',
            product: product || null,
          })
        })
    )
  )

  messages.sort((a, b) => b.date.localeCompare(a.date))
  return messages
}
