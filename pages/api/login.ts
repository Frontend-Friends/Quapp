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
    console.log(error + " - Couldn't login")
  }
}

async function sessionLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email
    const password = req.body.password

    const credentials = await login(email, password)
    const uid = credentials?.user.uid
    req.session.user = await fetchUser((uid as string) || '')
    await req.session.save()
    res.send({ session: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(sessionLogin, ironOptions)
