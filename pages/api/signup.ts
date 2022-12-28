import { NextApiRequest, NextApiResponse } from 'next'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { auth } from '../../config/firebase'
import { setDoc } from 'firebase/firestore'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { SignupType } from '../../components/products/types'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

export default async function signupRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const referer = req.headers.referer
  const refUrl = referer ? new URL(referer) : undefined
  const { fields } = await parsedForm<{ fields: SignupType }>(req)
  try {
    if (!refUrl) {
      new Error(`We didn't send any referer`)
      return
    }
    const actionCodeSettings = {
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${refUrl.protocol}//${refUrl.host}/auth/login?name=${fields.firstName}`,
      // This must be true.
      handleCodeInApp: true,
    }
    const { email, firstName, password } = fields
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
    const [userRef] = getUserRef(credentials.user.uid)
    await setDoc(userRef, {
      email,
      firstName,
      userName: firstName,
    })

    // //no session here, because we don't want to log in the user after signup
    res.status(200).json({ isSignedUp: true })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'SIGNUP_something_went_wrong', isSignedUp: false })
  }
}
