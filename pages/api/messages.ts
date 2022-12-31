import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchMessages } from '../../lib/services/fetch-messages'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export const messages = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.session
  try {
    if (!user || !user.id) {
      throw new Error('no User')
    }
    const fetchedMessages = await fetchMessages(user.id)
    sendResponse(res, { messages: fetchedMessages })
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(messages, sessionOptions)
