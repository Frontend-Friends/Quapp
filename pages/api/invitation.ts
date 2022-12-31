import { NextApiRequest, NextApiResponse } from 'next'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { UserFormData } from '../../components/products/types'
import sgMail from '@sendgrid/mail'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function invitation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields } = await parsedForm<UserFormData>(req)
    const invitationRef = collection(db, 'invitations')

    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')
    //todo change env variable (URL) to production
    const msg = {
      to: fields.email,
      from: process.env.EMAIL ?? '',
      subject: 'You are invited to join a space',
      text: `Hi ${fields.firstName},\n\nYour space:  ${
        process.env.URL
      }/auth/login?invitation=${'uid - of - invite - doc'}\n\n${
        fields.space
      }\n\nBest regards,\n\nYour QUAPP team`,
    }
    const sendMail = await sgMail.send(msg)
    const addInvitation = await addDoc(invitationRef, {
      ...fields,
    })
    await Promise.all([sendMail, addInvitation])
    sendResponse(res, { message: 'Email sent successfully' })
  } catch (err) {
    console.error(err)
    sendError(res, { invitationIsOk: false, message: 'An error occurred' })
  }
}

export default invitation
