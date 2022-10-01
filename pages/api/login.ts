import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number
      admin?: boolean
    }
  }
}

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // get user from database then:

  req.session.user = {
    id: 230,
    admin: true,
  }
  await req.session.save()
  res.send({ ok: true })
}

export default withIronSessionApiRoute(loginRoute, ironOptions)

// const { username } = await req.body;
//
// try {
//   const {
//     data: { login, avatar_url },
//   } = await octokit.rest.users.getByUsername({ username });
//
//   const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User;
//   req.session.user = user;
//   await req.session.save();
//   res.json(user);
// } catch (error) {
//   res.status(500).json({ message: (error as Error).message });
// }
