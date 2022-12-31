import { NextApiRequest, NextApiResponse } from 'next'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { UserFormData } from '../../components/products/types'
import sgMail from '@sendgrid/mail'
import { addDoc, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../lib/config'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function invitation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session
    const { fields } = await parsedForm<UserFormData>(req)
    const invitationRef = collection(db, 'invitations')
    const addInvitation = await addDoc(invitationRef, {
      ...fields,
    })

    //get id of the invitation
    const invitationId = addInvitation.id

    const spaceRef = doc(db, 'spaces', fields?.space)
    const spaceDoc = await getDoc(spaceRef)
    const space = spaceDoc.data()

    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')
    //todo change env variable (URL) to production
    const msg = {
      to: fields.email,
      from: process.env.EMAIL ?? '',
      subject: 'You are invited to join a space',
      text: `Hi ${fields.firstName},\n\n
       ${user?.firstName} invited you to join the space ${space?.name}. Join this space:  ${process.env.URL}/auth/login?invitation=${invitationId}\n\n
      Best regards,\n\nYour QUAPP team`,
    }
    const sendMail = await sgMail.send(msg)

    await Promise.all([sendMail, addInvitation])
    sendResponse(res, { message: 'Email sent successfully' })
  } catch (err) {
    console.error(err)
    sendError(res, { invitationIsOk: false, message: 'An error occurred' })
  }
}

export default withIronSessionApiRoute(invitation, ironOptions)
