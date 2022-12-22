import { NextApiRequest, NextApiResponse } from 'next'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../config/firebase'

async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email
    sendPasswordResetEmail(auth, email)
      .then(() => {
        res.send({ isOk: true })
      })
      .catch((error) => {
        const errorMessage = error.message
        res.send({ isOk: false, message: errorMessage })
      })
  } catch (error) {
    res.send({ message: 'THE RESET EMAIL COULD NOT BEEN SENT TO YOU' })
  }
}

export default resetPassword
