import { NextApiRequest, NextApiResponse } from 'next'
import { addDoc, collection } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { db } from '../../config/firebase'
import { AddSpaceType } from '../../components/products/types'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function addSpace(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    if (!user) {
      res.redirect('/auth/login')
      return
    }
    const uid = req.session.user?.uid
    const spaceRef = collection(db, 'spaces', '/')

    const formData = await parsedForm<AddSpaceType>(req)
    const data = {
      ...formData.fields,
    }
    await addDoc(spaceRef, {
      ...data,
      ownerId: `/user/${uid}`,
      creatorId: `/user/${uid}`,
    })

    res.status(200).json({ isOk: true, space: { ...data } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ isOk: false })
  }
}

export default withIronSessionApiRoute(addSpace, sessionOptions)
