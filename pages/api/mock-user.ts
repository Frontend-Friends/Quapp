import { mockUsers } from '../../mock/mock-users'
import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const [user1] = await mockUsers()

    req.session.user = user1

    await req.session.save()

    res.status(200).json(user1)
  },
  sessionOptions
)
