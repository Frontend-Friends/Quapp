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
import { SpaceFormData, SpaceItemType } from '../../components/products/types'
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

    const id = req.session.user?.id
    const spaceRef = collection(db, 'spaces')
    const userRef = doc(db, 'user', id ?? '')

    const formData = await parsedForm<SpaceFormData>(req)
    const spaceName = {
      ...formData.fields,
    }
    // add space to spaces collection
    const spaceData = {
      ...spaceName,
      ownerId: `/user/${id}`,
      creatorId: `/user/${id}`,
      creationDate: new Date(),
      users: [id ?? ''],
    }
    const newSpaceId = await addDoc(spaceRef, {
      ...spaceData,
    }).then((result) => result.id)

    // add space-id to spaces property of user
    const userUpdate = await updateDoc(userRef, {
      spaces: arrayUnion(newSpaceId),
    })
    await Promise.all([newSpaceId, userUpdate])
    sendResponse<{ space: SpaceItemType; message: string; spaceId: string }>(
      res,
      {
        space: { ...spaceData },
        message: `The space ${spaceName.name} is added to spaces and to your profile.`,
        spaceId: newSpaceId,
      }
    )
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(addSpace, sessionOptions)
