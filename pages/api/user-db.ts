import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body)
  if (req.method === 'POST') {
    try {
      const { email, firstName, lastName, phone } = JSON.parse(req.body)

      await addDoc(collection(db, 'user'), {
        email,
        firstName,
        lastName,
        phone,
      }).then((result) => {
        res.status(200).json({ res: 'ok' })
        console.log('Document written with ID: ', { res: 'ok' })
        return result
      })
    } catch (err) {
      console.log('Error adding document: ', err)
      res.status(500).json({ err })
    }
  } else if (req.method === 'GET') {
    // Handle any GET requests
  } else if (req.method === 'DELETE') {
    // Handle Delete requests
  }
}
