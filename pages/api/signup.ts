import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'

// 2 tasks: sign up in firebase auth (OK) and put data into firebase database (all user infos).

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      email: string
      password: string
    }
  }
}

const signup = (email: string, password: string) => {
  console.log(auth, email, password)
  return createUserWithEmailAndPassword(auth, email, password)
}

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email
    const password = req.body.password

    const credentials = await signup(email, password)

    const user = (req.session.user = {
      email,
      uid: credentials.user.uid,
    })
    await req.session.save()
    res.send({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(signupRoute, ironOptions)
