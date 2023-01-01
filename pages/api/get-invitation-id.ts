import { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { db } from '../../config/firebase'

async function getInvitationId(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.query
    let invitationId = ''

    const invitationCollection = collection(db, 'invitations')
    const q = query(invitationCollection, where('email', '==', email))
    const querySnapshot = getDocs(q)
    querySnapshot
      .then((result) => {
        const foundInvitation = result.docs.map((document) => {
          invitationId = document.id
        })
        if (foundInvitation) {
          sendResponse(res, { invitationId })
        } else {
          sendError(res, { message: 'no invitation found' })
        }
      })
      .catch((error) => {
        sendError(res, error)
      })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default getInvitationId
