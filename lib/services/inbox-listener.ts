import { getUserRef } from '../helpers/refs/get-user-ref'
import { collection, onSnapshot } from 'firebase/firestore'
import { Message } from '../../components/message/type'
import { fetchProduct } from './fetch-product'
import { fetchUser } from './fetch-user'

export const inboxListener = (
  userId: string,
  setMessage: (state: Message[]) => void
) => {
  const [, userPath] = getUserRef(userId)
  const messageCollection = collection(...userPath, 'messages')

  return onSnapshot(messageCollection, async (docs) => {
    const messages = await Promise.all<Message>(
      docs.docs.map(
        (item) =>
          new Promise(async (resolve) => {
            const message = {
              id: item.id,
              date: item.id,
              ...item.data(),
            } as Message

            const product =
              message.type === 'borrowRequest' ||
              message.type === 'borrowResponse'
                ? await fetchProduct(message.space, message.productId)
                : null

            const requester = await fetchUser(
              message.type === 'borrowRequest'
                ? message.requesterId
                : message.productOwnerId
            )
            return resolve({
              ...message,
              userName: requester.userName || '',
              product: product || null,
            } as Message)
          })
      )
    )
    messages.sort((a, b) => b.date.localeCompare(a.date))
    setMessage([...messages])
  })
}
