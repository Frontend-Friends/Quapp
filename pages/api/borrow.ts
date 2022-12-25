import { NextApiRequest, NextApiResponse } from 'next'
import { doc, setDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { db } from '../../config/firebase'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const value = req.body

  const { user } = req.session

  if (!user || !user.id) {
    res.status(500).json({ ok: false })
    return
  }

  const parsedValue = { ...JSON.parse(value), status: 'pending' }

  const messageRef = doc(
    db,
    'inbox',
    user.id,
    'messages',
    new Date().getTime().toString()
  )

  const send = await setDoc(messageRef, parsedValue).then((r) => r)
  console.log(send)

  res.status(200).json({ ok: true })
}

export default withIronSessionApiRoute(handler, sessionOptions)
