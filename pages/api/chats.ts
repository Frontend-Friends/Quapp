import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { doc, getDoc } from 'firebase/firestore'
import { sortChatByTime } from '../../lib/scripts/sort-chat-by-time'
import { getProductRef } from '../../lib/helpers/refs/get-product-ref'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

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

    const docRef = doc(...productPath, 'chats', chatId)

    const fetchedChat = await getDoc(docRef).then((r) => r.data())
    const currentHistory = fetchedChat?.history || []

    sendResponse(res, { history: sortChatByTime(currentHistory) })
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(chats, sessionOptions)
