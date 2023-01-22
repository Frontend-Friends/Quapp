import { getProductRef } from '../helpers/refs/get-product-ref'
import { ChatMessage, ProductChatType } from '../../components/products/types'
import { collection, doc, DocumentData, onSnapshot } from 'firebase/firestore'
import { getUser } from './get-user'
import { Dispatch, SetStateAction } from 'react'
import { sortChatByTime } from '../scripts/sort-chat-by-time'

export const subScribeChats = (
  space: string,
  chatId: string,
  productId: string,
  setChats: Dispatch<SetStateAction<ProductChatType[]>>,
  updateChat: (chatId: string | null) => (history: ChatMessage[]) => void,
  tabId: string | null
) => {
  const [, productPath] = getProductRef(space as string, productId)

  let unsubscribe
  if (chatId === '') {
    const chatCollection = collection(...productPath, 'chats')

    unsubscribe = onSnapshot(chatCollection, async (docs) => {
      const allChats = await Promise.all<ProductChatType>(
        docs.docs.map(
          (entry) =>
            new Promise(async (resolve) => {
              const data = entry.data()
              const [fetchedUser] = await getUser(entry.id)
              resolve({
                chatUserId: entry.id,
                chatUserName: fetchedUser.userName || '',
                history: sortChatByTime(data.history),
              })
            })
        )
      )
      if (allChats.length) {
        setChats(allChats)
      }
    })
  } else {
    const docRef = doc(...productPath, 'chats', chatId)
    unsubscribe = onSnapshot(docRef, (item) => {
      const fetchedChat = {
        id: item.id,
        ...item.data(),
      } as DocumentData
      updateChat(tabId || fetchedChat.userId)(
        fetchedChat?.history ? sortChatByTime(fetchedChat.history) : []
      )
    })
  }
  return unsubscribe
}
