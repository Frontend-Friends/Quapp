import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../lib/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { fetchUser } from '../../lib/services/fetch-user'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

async function sessionLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { password, email } = JSON.parse(req.body)

    const credentials = await login(email, password)

    const uid = credentials?.user.uid
    const isEmailVerified = credentials?.user.emailVerified
    if (isEmailVerified) {
      req.session.user = await fetchUser((uid as string) || '')
      await req.session.save()
      sendResponse(res)
    } else {
      sendError(res)
    }
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(sessionLogin, ironOptions)
