import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { ProductChatType, ProductType } from '../../components/products/types'

export const fetchProduct = async (productsQuery: string) => {
  const ref = doc(db, 'products', productsQuery || '')
  const chatCollection = collection(db, 'products', productsQuery || '', 'chat')
  const productDetailSnap = await getDoc(ref).then(
    (r) =>
      ({
        ...r.data(),
        id: r.id,
      } as DocumentData)
  )

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
  const chats = await Promise.all(
    chatData.map(async ({ chat, chatUserId }) => {
      const userRef = doc(db, 'user', chatUserId)
      const user = await getDoc(userRef).then((r) => r.data())
      return {
        chatUserName: user?.userName || null,
        chatUserId,
        history: chat.history || [],
      } as ProductChatType
    })
  )
  const owner = await getDoc(productDetailSnap.owner).then<{
    id: string
    userName: string
  }>((r) => ({
    userName: (r.data() as { userName: string }).userName,
    id: r.id,
  }))

  return {
    ...productDetailSnap,
    owner: { userName: owner.userName, id: owner.id },
    chats,
  } as ProductType
}