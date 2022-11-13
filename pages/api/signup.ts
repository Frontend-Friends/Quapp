import { NextApiRequest, NextApiResponse } from 'next'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { User } from '../../interfaces/user'

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}

export default async function signupRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, firstName, lastName, phone } = req.body
    const password = req.body.password
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const userRef = doc(db, 'user', credentials.user.uid)
    await setDoc(userRef, {
      email,
      firstName,
      lastName,
      phone,
    })

    //no session here, because we don't want to log in the user after signup
    res.status(200).json({ isSignedUp: true })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: (error as Error).message, isSignedUp: false })
  }
}
