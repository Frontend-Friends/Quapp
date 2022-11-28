import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'

export default withIronSessionApiRoute(
  <NextApiHandler>(
    async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
      await signOut(auth).then(() => console.log('is logged out'))

      req.session.destroy()
      res.send({ isLoggedOut: true })
    }
  ),
  {
    ...ironOptions,
  }
)
