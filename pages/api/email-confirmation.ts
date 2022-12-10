import { NextApiRequest, NextApiResponse } from 'next'
import { signInWithEmailLink } from 'firebase/auth'
import { auth } from '../../config/firebase'
import url from 'url'
export default async function emailConfirmation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const confirmationUrl = req.headers.referer
    // get the email from the query string in confirmationUrl
    const parsedUrl = url.parse(confirmationUrl as string, true)
    const queryParams = parsedUrl.query
    const email = queryParams.email as string

    return await signInWithEmailLink(auth, email, confirmationUrl)
      .then((result) => {
        res.send({ message: 'Email confirmation successful' })
        console.log('result:', result)
        // You can access the new user via result.user
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        //todo add session
      })
      .catch((error) => {
        res.send({
          message: 'signInWithEmailLink failed (in try block)',
          error: error,
        })
      })
  } catch (error) {
    res.status(500).json({
      message: 'error 500 in emailConfirmation (in catch block)',
      error: error,
    })
  }
}
