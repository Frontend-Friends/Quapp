import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { ProductChatType, ProductType } from '../../components/products/types'
import { sortChatByTime } from '../scripts/sort-chat-by-time'
import { getProduct } from './get-product'
import { getProductRef } from '../helpers/refs/get-product-ref'
import { fetchUser } from './fetch-user'
import { getUserRef } from '../helpers/refs/get-user-ref'
import { Message } from '../../components/message/type'
import { fetchSpace } from './fetch-space'

export const fetchProduct = async (
  space: string,
  productsQuery: string,
  userId?: string
) => {
  const [, productPath] = getProductRef(space, productsQuery)
  const chatCollection = collection(...productPath, 'chats')
  const [productDetailSnap] = await getProduct(productsQuery, space)

  const fetchedSpace = await fetchSpace(space)
  if (Object.keys(productDetailSnap).length <= 1) {
    return undefined
  }

  const [, ownerPath] = userId ? getUserRef(userId) : []
  const messages: Message[] = []
  if (ownerPath && userId === productDetailSnap.owner.id) {
    const messagesCollection = collection(...ownerPath, 'messages')
    const q = query(
      messagesCollection,
      where('type', '==', 'borrowRequest'),
      where('productId', '==', productsQuery)
    )
    const messagesSnap = await getDocs(q)

    await Promise.all(
      messagesSnap.docs.map(
        (item) =>
          new Promise(async (resolve) => {
            const message = { date: item.id, ...item.data() } as Message
            const userName = await fetchUser(message.requesterId)
            message.userName = userName.userName || ''
            messages.push(message)
            return resolve(true)
          })
      )
    )
  }

  const chatSnapShot = await getDocs(chatCollection)
  const chatData: DocumentData[] = []
  chatSnapShot.forEach((chatItem) => {
    chatData.push({
      chat: chatItem.data(),
      chatUserId: chatItem.id,
    })
  })
  const [owner, ...chats] = await Promise.all([
    fetchUser(productDetailSnap.owner.id),
    ...chatData.map(async ({ chat, chatUserId }) => {
      const user = await fetchUser(chatUserId)
      return {
        chatUserName: user?.userName || null,
        chatUserId,
        history: chat.history || [],
      } as ProductChatType
    }),
  ])

  const sortedChats = chats.map((item) => {
    const sortedHistory = sortChatByTime(item.history)
    return { ...item, history: sortedHistory }
  })

  return {
    ...productDetailSnap,
    owner: { userName: owner.userName || null, id: owner.id },
    chats: sortedChats,
    messages,
    spaceId: fetchedSpace.id,
    spaceName: fetchedSpace.name,
  } as ProductType
}
