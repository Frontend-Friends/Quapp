import { NextApiRequest, NextApiResponse } from 'next'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default async function signupRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { protocol, host } = req.body
  const actionCodeSettings = {
    // URL must be in the authorized domains list in the Firebase Console.
    url: `${protocol}//${host}/auth/login?name=${req.body.name}`,
    // This must be true.
    handleCodeInApp: true,
  }
  try {
    const { email, firstName } = req.body
    const password = req.body.password
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    await sendEmailVerification(credentials.user, actionCodeSettings).catch(
      () => {
        res.send({ session: false, message: 'SIGNUP_something_went_wrong' })
      }
    )
    const userRef = doc(db, 'user', credentials.user.uid)
    await setDoc(userRef, {
      email,
      firstName,
    })

    // //no session here, because we don't want to log in the user after signup
    res.status(200).json({ isSignedUp: true })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'SIGNUP_something_went_wrong', isSignedUp: false })
  }
}
