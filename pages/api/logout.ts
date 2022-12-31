import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export default withIronSessionApiRoute(
  <NextApiHandler>(
    async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
      try {
        await signOut(auth).then(() => console.log('is logged out'))

        req.session.destroy()
        sendResponse(res)
      } catch (error) {
        console.error(error)
        sendError(res)
      }
    }
  ),
  {
    ...ironOptions,
  }
)
