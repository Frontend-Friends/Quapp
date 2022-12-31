import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { sortChatByTime } from '../../lib/scripts/sort-chat-by-time'
import { getProductRef } from '../../lib/helpers/refs/get-product-ref'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function sendChat(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    const { space } = req.query

    if (!user) {
      sendError(res)
      return
    }

    const formData = await parsedForm<{
      fields: {
        message: string
        productId: string
        fromOwner: boolean
        chatId: string
      }
    }>(req)

    const { productId, chatId } = formData.fields

    const [, productPath] = getProductRef(space as string, productId)

    const docRef = doc(...productPath, 'chats', chatId)

    const fetchedChat = await getDoc(docRef).then((r) => r.data())
    const currentHistory = fetchedChat?.history || []
    const history = [
      ...currentHistory,
      { dateTime: new Date().toISOString(), ...formData.fields },
    ].filter((item) => !!item)

    await setDoc(docRef, {
      history,
    })

    sendResponse(res, { history: sortChatByTime(history) })
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(sendChat, sessionOptions)
