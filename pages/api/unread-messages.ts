import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'
import { collection, getDocs, query, where } from 'firebase/firestore'

export async function unreadMessages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.session
  try {
    if (!user || !user.id) {
      throw new Error('no User')
    }
    const [, userPath] = getUserRef(user.id)
    const messageCollection = collection(...userPath, 'messages')
    const q = query(messageCollection, where('read', '==', false))
    const messages = await getDocs(q)
    res.status(200).json({
      messages: messages.docs.map((doc) => ({
        id: doc.id,
        date: doc.id,
        ...doc.data(),
      })),
    })
  } catch {
    res.status(500).json({ ok: false })
  }
}

export default withIronSessionApiRoute(unreadMessages, sessionOptions)
