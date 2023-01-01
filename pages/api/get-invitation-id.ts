import { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { db } from '../../config/firebase'

async function getInvitationId(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.query
    const invitationCollection = collection(db, 'invitations')
    const q = query(invitationCollection, where('email', '==', email))
    const querySnapshot = getDocs(q)
    querySnapshot.then((result) =>
      result.docs.find((document) => {
        const invitationId = document.id
        sendResponse(res, { invitationId })
      })
    )
    // sendResponse(res, { message: "ok" })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default getInvitationId
