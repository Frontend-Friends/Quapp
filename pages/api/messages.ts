import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchMessages } from '../../lib/services/fetch-messages'

export const messages = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.session
  try {
    if (!user || !user.id) {
      throw new Error('no User')
    }
    const fetchedMessages = await fetchMessages(user.id)
    res.status(200).json({ messages: fetchedMessages, ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
}

export default withIronSessionApiRoute(messages, sessionOptions)
