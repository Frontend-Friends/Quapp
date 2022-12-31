import { NextApiRequest, NextApiResponse } from 'next'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { db } from '../../config/firebase'
import { SpaceFormData } from '../../components/products/types'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

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
    const spaceRef = collection(db, 'spaces')
    const userRef = doc(db, 'user', uid ?? '')

    const formData = await parsedForm<SpaceFormData>(req)
    const spaceData = {
      ...formData.fields,
    }
    // add space to spaces collection
    const addNewSpace = await addDoc(spaceRef, {
      ...spaceData,
      ownerId: `/user/${uid}`,
      creatorId: `/user/${uid}`,
      creationDate: new Date(),
      users: [uid],
    }).then((result) => result.id)

    // add space-id to spaces property of user
    const userUpdate = await updateDoc(userRef, {
      spaces: arrayUnion(addNewSpace),
    })

    await Promise.all([addNewSpace, userUpdate])
    sendResponse(res, {
      space: { ...spaceData },
      message: `The space ${spaceData.name} is added to spaces and to your profile.`,
    })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(addSpace, sessionOptions)
