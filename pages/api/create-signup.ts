import { doc as document, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { User } from '../../components/user/types'

export default async function userDb(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //signup
  try {
    const { email, firstName } = JSON.parse(req.body)
    const emailHash = crypto.createHash('md5').update(email).digest('hex')
    const userRef = document(db, 'user', emailHash)
    await setDoc(userRef, {
      email,
      firstName,
    } as User).then((result) => {
      res.status(200).json({ res: 'ok' })
      console.log('Document written with ID: ', { res: 'ok' })
      return result
    })
  } catch (err) {
    console.log('Error adding document: ', err)
    res.status(500).json({ err })
  }
}
