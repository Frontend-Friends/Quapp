import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../config/session-config'

export default withIronSessionApiRoute(
  function userRoute(req: NextApiRequest, res: NextApiResponse) {
    res.send({ user: req.session.user })
  },
  {
    ...sessionOptions,
  }
)
