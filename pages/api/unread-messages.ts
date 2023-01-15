import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

export async function unreadMessages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.session
  try {
    if (!user || !user.id) {
      console.error('No User or User Id')
      sendResponse(res, { ok: false, messages: [] })
      return
    }
    const [, userPath] = getUserRef(user.id)
    const messageCollection = collection(...userPath, 'messages')
    const q = query(messageCollection, where('read', '==', false))
    const messages = await getDocs(q)
    sendResponse(res, {
      messages: messages.docs.map((doc) => ({
        id: doc.id,
        date: doc.id,
        ...doc.data(),
      })),
    })
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(unreadMessages, sessionOptions)
