import { NextApiRequest, NextApiResponse } from 'next'
import { doc, getDoc } from 'firebase/firestore'
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
    const invitationDoc = await getDoc(invitationRef).then((r) => r.data())
    console.log(invitationDoc?.ref)
    res.status(200).send({ message: 'Space added' })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      invitationIsOk: false,
      message: 'An error occurred',
    })
  }
}

export default getInvitation
