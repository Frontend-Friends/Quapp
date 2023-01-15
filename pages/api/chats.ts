import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { sortChatByTime } from '../../lib/scripts/sort-chat-by-time'
import { getProductRef } from '../../lib/helpers/refs/get-product-ref'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { ProductChatType } from '../../components/products/types'
import { getUser } from '../../lib/services/get-user'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function chats(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    const { space, chatId, productId } = req.query as {
      space: string
      chatId: string
      productId: string
    }

    if (!user) {
      sendError(res)
      return
    }

    const [, productPath] = getProductRef(space as string, productId)

    let allChats: ProductChatType[] = []
    let fetchedChat
    if (chatId === '') {
      const chatCollection = collection(...productPath, 'chats')
      const fetchedChatCollection = await getDocs(chatCollection)
      allChats = await Promise.all<ProductChatType>(
        fetchedChatCollection.docs.map(
          (entry) =>
            new Promise(async (resolve) => {
              const data = entry.data()
              const [fetchedUser] = await getUser(entry.id)
              resolve({
                chatUserId: entry.id,
                chatUserName: fetchedUser.userName || '',
                history: data.history,
              })
            })
        )
      )
    } else {
      const docRef = doc(...productPath, 'chats', chatId)
      fetchedChat = await getDoc(docRef).then(
        (r) =>
          ({
            id: r.id,
            ...r.data(),
          } as DocumentData)
      )
    }
    const currentHistory = fetchedChat?.history || []

    sendResponse(res, {
      history: sortChatByTime(currentHistory),
      userId: fetchedChat?.userId || null,
      chats: allChats,
    })
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(chats, sessionOptions)
