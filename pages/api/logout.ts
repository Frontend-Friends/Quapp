import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(
  <NextApiHandler>(
    function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
      req.session.destroy()
      res.send({ ok: true })
    }
  ),
  {
    cookieName: '__session',
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
)
