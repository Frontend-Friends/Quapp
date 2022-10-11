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
