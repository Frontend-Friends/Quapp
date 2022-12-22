import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { fetchUser } from '../../lib/services/fetch-user'

const login = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('error: Could not login')
  }
}

async function sessionLogin(req: NextApiRequest, res: NextApiResponse) {
  const email = req.body.email
  const password = req.body.password
  const credentials = await login(email, password)

  const uid = credentials?.user.uid
  const isEmailVerified = credentials?.user.emailVerified
  if (isEmailVerified) {
    req.session.user = await fetchUser((uid as string) || '')
    await req.session.save()
    res.send({ session: true })
  } else {
    res.send({
      session: false,
      message: 'Your email not verified or you provided wrong credentials',
    })
  }
}

export default withIronSessionApiRoute(sessionLogin, ironOptions)
