import { NextApiRequest, NextApiResponse } from 'next'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = JSON.parse(req.body)
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.URL}/auth/login` ?? '',
    })
    sendResponse(res)
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default resetPassword
