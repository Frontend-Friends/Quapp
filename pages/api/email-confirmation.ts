import { NextApiRequest, NextApiResponse } from 'next'
import { signInWithEmailLink } from 'firebase/auth'
import { auth } from '../../config/firebase'

export default async function emailConfirmation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    return await signInWithEmailLink(
      auth,
      'lkerbage@gmx.net',
      'http://localhost:3000/auth/email-confirmation'
    )
      .then((result) => {
        // Clear email from storage.
        res.send({ message: 'Email confirmation successful' })
        console.log(result.user)
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        res.send({
          message: 'signInWithEmailLink failed (in try block)',
          error: error,
        })
      })
  } catch (error) {
    res.status(500).json({
      message: 'error in emailConfirmation (in catch block)',
      error: error,
    })
  }
}
