import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { updateMessage } from '../../lib/services/update-message'
import { Message } from '../../components/message/type'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    if (!user || !user.id) {
      console.error('No User or User Id')
      sendError(res)
      return
    }

    const data = JSON.parse(req.body) as Message

    await updateMessage(user.id, data)

    sendResponse(res)
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
