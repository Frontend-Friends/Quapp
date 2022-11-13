import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions, server } from '../../lib/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { User } from '../../interfaces/user'

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

const getUser = async (email: string) => {
  await fetchJson(`${server}/api/user-db?email=${email}`)
}

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email
    const password = req.body.password
    const uid = req.body.uid
    const credentials = await login(email, password)
    const user = (req.session.user = {
      email,
      password,
      uid,
    })
    await getUser(email)
    await req.session.save()
    res.send({ session: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(loginRoute, ironOptions)
