import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      email: string
      password: string
    }
  }
}

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email
    const password = req.body.password

    const credentials = await login(email, password)

    const user = (req.session.user = {
      email,
      uid: credentials.user.uid,
    })

    console.log(user)

    await req.session.save()
    res.send({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: (error as Error).message })
  }
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
