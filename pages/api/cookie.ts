import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

async function cookie(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session
    if (user) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      sendResponse(res, {
        isUser: true,
      })
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      sendResponse(res, {
        isUser: false,
      })
    }
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(cookie, sessionOptions)
