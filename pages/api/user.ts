import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.send({ user: req.session.user })
  },
  {
    cookieName: '__session',
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
)
