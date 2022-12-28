import { NextApiRequest, NextApiResponse } from 'next'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { UserFormData } from '../../components/products/types'
import sgMail from '@sendgrid/mail'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function invitation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields } = await parsedForm<UserFormData>(req)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')

    const msg = {
      to: fields.email,
      from: process.env.EMAIL ?? '',
      subject: 'Thank you for your message',
      text: `Hi ${
        fields.firstName
      },\n\nYour space: /auth/login?invitation=${'uid - of - invite - doc'}\n\n${
        fields.space
      }\n\nBest regards,\n\nYour QUAPP team`,
    }
    await sgMail
      .send(msg)
      .then((r) => console.log(r))
      .catch((e) => console.log(e))
    res.status(200).send({ message: 'Email sent successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      invitationIsOk: false,
      message: 'An error occurred',
    })
  }
}

export default invitation
