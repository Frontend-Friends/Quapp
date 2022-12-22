import { NextApiRequest, NextApiResponse } from 'next'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { SettingType, User } from '../../components/user/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../lib/config'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function accountSettings(req: NextApiRequest, res: NextApiResponse) {
  const formData = await parsedForm<{
    fields: SettingType
  }>(req)

  const userFields = formData.fields
  const id = req.session.user?.id
  const docRef = doc(db, `user/${id}`)
  const fetchedSettings = await getDoc(docRef).then((r) => r.data())

  const updatedFields = { ...fetchedSettings, ...userFields }
  await setDoc(docRef, {
    ...updatedFields,
  })
  req.session.user = {
    ...(updatedFields as User),
  }
  await req.session.save()
  res.json({ isOk: true })
}

export default withIronSessionApiRoute(accountSettings, ironOptions)
