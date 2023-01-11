import { NextApiRequest, NextApiResponse } from 'next'
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

async function getInvitation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { invitation } = req.query
    const invitationRef = doc(db, 'invitations', invitation as string)
    const invitedPerson = await getDoc(invitationRef).then(async (r) => {
      return { ...r.data(), id: r.id } as DocumentData
    })

    // check if the invited person is already a user by searching email in db
    const userCollection = collection(db, 'user')
    const q = query(
      userCollection,
      where('email', '==', invitedPerson?.email || '')
    )
    const querySnapshot = await getDocs(q)
    const [user] = querySnapshot.docs.map((document) => {
      return { ...document.data(), id: document.id } as DocumentData
    })
    if (!user?.email) {
      sendResponse(res, {
        message:
          'You are not yet signed up. You are being redirected to signup ...',
        ok: false,
        isSignedUp: false,
      })
      return
    }
    //invited user already exists in db
    const userRef = doc(db, 'user', user.id)
    const spaceRef = doc(db, 'spaces', invitedPerson?.space)

    // add space-id to user
    const isAddedSpaceToUser = await updateDoc(userRef, {
      spaces: arrayUnion(
        invitedPerson?.space ?? 'no user provided in invitation'
      ),
    }).then(() => true)

    // add user-id to space
    const isAddedUserToSpace = await updateDoc(spaceRef, {
      users: arrayUnion(user.id ?? 'no user provided in invitation'),
    }).then(() => true)

    const isAddedIds = isAddedSpaceToUser && isAddedUserToSpace
    if (isAddedIds) {
      sendResponse(res, {
        message: 'Your profile is now linked to the space',
        ok: true,
        space: invitedPerson?.space,
        isSignedUp: true,
        invitationId: invitedPerson.id,
      })
      return
    }
    sendResponse(res, { message: 'Invitation failed', ok: false })
  } catch (err) {
    console.error(err)
    sendError(res, {
      ok: false,
      message: 'Invitation not found. You are being redirected to signup..',
    })
  }
}

export default getInvitation
