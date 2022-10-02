// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//
// import { NextApiRequest, NextApiResponse } from 'next'
//
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   res.status(200).json({ name: 'John Doe' })
// }

import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      email: string
      password: string
    }
  }
}
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // get user from database then:

  const user = (req.session.user = {
    email: req.body.email,
    password: req.body.password,
  })
  await req.session.save()
  res.send({ ok: true, user })
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
