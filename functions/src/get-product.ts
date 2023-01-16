import { sortChatByTime } from './sort-chat-by-time'
import { getRef } from './get-ref'
import { fetchProduct } from './fetch-product'
import { getSpace } from './get-space'
import { app } from './admin'
import { getUser } from './get-user'
import { DocumentData } from 'firebase-admin/firestore'

const store = app.firestore()

export const product = async (
  space: string,
  productsQuery: string,
  userId?: string
) => {
  const [productDetailSnap] = await fetchProduct(productsQuery, space)

  const fetchedSpace = await getSpace(space)
  if (Object.keys(productDetailSnap).length <= 1) {
    return undefined
  }

  const ownerPath = userId ? getRef('user', userId, 'messages') : undefined
  const messages: DocumentData[] = []
  if (ownerPath && userId === productDetailSnap.owner.id) {
    const messagesSnap = await store
      .collection(ownerPath)
      .where('type', '==', 'borrowRequest')
      .where('productId', '==', productsQuery)
      .get()
      .then((r) => r)

    await Promise.all(
      messagesSnap.docs.map(
        (item) =>
          new Promise(async (resolve) => {
            const message = { date: item.id, ...item.data() } as DocumentData
            const userName = await getUser(message.requesterId)
            message.userName = userName.userName || ''
            messages.push(message)
            return resolve(true)
          })
      )
    )
  }

  const chatData = await store
    .collection(getRef('spaces', space, 'products', productsQuery, 'chats'))
    .get()
    .then((r) =>
      r.docs.map((chatItem) => ({
        chat: chatItem.data(),
        chatUserId: chatItem.id,
      }))
    )
  const [owner, ...chats] = await Promise.all([
    getUser(productDetailSnap.owner.id),
    ...chatData.map(async ({ chat, chatUserId }) => {
      const user = await getUser(chatUserId)
      return {
        chatUserName: user?.userName || null,
        chatUserId,
        history: chat.history || [],
      } as DocumentData
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
  } as DocumentData
}
