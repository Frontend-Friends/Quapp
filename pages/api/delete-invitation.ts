import { NextApiRequest, NextApiResponse } from 'next'
import { deleteDoc, doc } from 'firebase/firestore'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { db } from '../../config/firebase'

async function deleteInvitation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { invitation } = req.query
    const invitationRef = doc(db, 'invitations', invitation as string)
    await deleteDoc(invitationRef)
    sendResponse(res, { message: 'The invitation is deleted' })
  } catch (err) {
    console.error(err)
    sendError(res, { message: 'The invitation is not deleted' })
  }
}

export default deleteInvitation
