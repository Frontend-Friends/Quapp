import { NextApiRequest, NextApiResponse } from 'next'
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function getInvitation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { invitation } = req.query
    const invitationRef = doc(db, 'invitations', invitation as string)
    await getDoc(invitationRef).then((r) => {
      const invitedPerson = r.data()
      const email = invitedPerson?.email
      // check if the invited person is already a user by searching email in db
      const userCollection = collection(db, 'user')
      const q = query(userCollection, where('email', '==', email))
      let userId = ''
      const querySnapshot = getDocs(q)
      querySnapshot
        .then((result) =>
          result.docs.map((document) => {
            userId = document.id
            return document.data()
          })
        )
        .then(async (userData) => {
          //invited user already exists in db
          if (userData[0]?.email) {
            const userRef = doc(db, 'user', userId)
            const spaceRef = doc(db, 'spaces', invitedPerson?.space)

            // add space-id to user
            const addSpaceToUser = await updateDoc(userRef, {
              spaces: arrayUnion(
                invitedPerson?.space ?? 'no user provided in invitation'
              ),
            })
              .then(() => true)
              .catch(() => false)

            // add user-id to space
            const addUserToSpace = await updateDoc(spaceRef, {
              users: arrayUnion(userId ?? 'no user provided in invitation'),
            })
              .then(() => true)
              .catch(() => false)
            const resolvedPromise = await Promise.all([
              addSpaceToUser,
              addUserToSpace,
            ])
            if (resolvedPromise) {
              sendResponse(res, {
                message: 'Your profile is now linked to the space',
                ok: true,
                space: invitedPerson?.space,
                isSignedUp: true,
              })
            } else {
              sendResponse(res, { message: 'Invitation failed', ok: false })
            }
          } else {
            //todo how to handle not-signed-up users (how to assign spaces to them)?
            sendResponse(res, {
              message:
                'You are not yet signed up. You are being redirected to signup ...',
              ok: false,
              isSignedUp: false,
            })
            return false
          }
        })
    })
  } catch (err) {
    console.error(err)
    sendError(res, {
      ok: false,
      message: 'Invitation not found. You are being redirected to signup..',
    })
  }
}

export default getInvitation
