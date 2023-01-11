import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function editSpace(req: NextApiRequest, res: NextApiResponse) {
  try {
    sendResponse(res, { message: 'edited space' })
  } catch {
    sendError(res, { message: 'error editing space' })
  }
}

export default withIronSessionApiRoute(editSpace, sessionOptions)
