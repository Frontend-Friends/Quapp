import {
  collection,
  doc as document,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

export default async function userDb(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    //signup
    try {
      const { email, firstName, lastName, phone } = JSON.parse(req.body)
      const emailHash = crypto.createHash('md5').update(email).digest('hex')
      const userRef = document(db, 'user', emailHash)
      await setDoc(userRef, {
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
  } else if (req.method === 'GET' && req.query.email) {
    //login
    try {
      const q = query(
        collection(db, 'user'),
        where('email', '==', req.query.email)
      )

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
      })
      res.status(200).json({ userFound: 'ok' })
    } catch (err) {
      console.log('Error receiving document: ', err)
      res.status(500).json({ err })
    }
  } else if (req.method === 'DELETE') {
    // Handle Delete requests
  }
}
