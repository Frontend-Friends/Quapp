import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendError } from '../../lib/helpers/send-error'
import { getUser } from '../../lib/services/get-user'
import { sendResponse } from '../../lib/helpers/send-response'

export const User = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.session

  if (!user || !user.id) {
    sendError(res)
    return
  }
  try {
    const [fetchedUser] = await getUser(user.id)
    sendResponse(res, { user: fetchedUser })
  } catch (err) {
    console.log(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(User, sessionOptions)
