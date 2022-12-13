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
  // todo export fn:
  const actionCodeSettings = {
    // URL must be in the authorized domains list in the Firebase Console.
    //todo add name
    url: `http://localhost:3000/auth/login?name=${req.body.name}`,
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
      (error) => {
        const errorMessage = error.message
        console.error('errorMessage:', errorMessage)
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
    console.error(error, 'error in signupRoute')
    res
      .status(500)
      .json({ message: (error as Error).message, isSignedUp: false })
  }
}
