import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      email: string
      password: string
    }
  }
}
debugger
const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email
    //todo @lk, make hash password
    const password = req.body.password
    const credentials = await signup(email, password)

    const user = (req.session.user = {
      email,
      uid: credentials.user.uid,
    })
    //no session here, because we don't want to log in the user after signup
    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(signupRoute, ironOptions)
