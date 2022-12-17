import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductChatType, ProductType } from '../../components/products/types'
import { sortChatByTime } from '../scripts/sort-chat-by-time'
import { getProduct } from './get-product'

export const fetchProduct = async (space: string, productsQuery: string) => {
  const chatCollection = collection(
    db,
    'spaces',
    space,
    'products',
    productsQuery || '',
    'chats'
  )
  const [productDetailSnap] = await getProduct(productsQuery, space)
  if (Object.keys(productDetailSnap).length <= 1) {
    return undefined
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
    await getDoc(productDetailSnap.owner).then<{
      id: string | null
      userName: string | null
    }>((r) => ({
      userName: (r.data() as { userName: string }).userName || null,
      id: r.id || null,
    })),
    ...chatData.map(async ({ chat, chatUserId }) => {
      const userRef = doc(db, 'user', chatUserId)
      const user = await getDoc(userRef).then((r) => r.data())
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
  } as ProductType
}
