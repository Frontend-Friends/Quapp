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
          //user exists
          if (userData[0]?.email) {
            const userRef = doc(db, 'user', userId)
            const spaceRef = doc(db, 'spaces', invitedPerson?.space)

            // add space-id to user
            const addSpaceToUser = await updateDoc(userRef, {
              spaces: arrayUnion(userId ?? 'no user provided in invitation'),
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
              res.status(200).send({
                message: 'Space added to user and user added to space',
                isOk: true,
                space: invitedPerson?.space,
                isSignedUp: true,
              })
            } else {
              res.status(200).send({
                message: 'Invitation failed',
                isOk: false,
              })
            }
          } else {
            console.log('user does not exist in user docs')
            res.status(200).send({
              message: 'You are not yet signed up. Redirecting to signup ...',
              isOk: false,
              isSignedUp: false,
            })
            return false
          }
        })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      isOk: false,
      message: 'Invitation not found. You are being redirected ...',
    })
  }
}

export default getInvitation
