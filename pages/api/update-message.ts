import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { updateMessage } from '../../lib/services/update-message'
import { Message } from '../../components/message/type'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session

  if (!user || !user.id) {
    res.status(500).json({ ok: false })
    return
  }

  const data = JSON.parse(req.body) as Message

  await updateMessage(user.id, data)

  res.status(200).json({ ok: true })
}

export default withIronSessionApiRoute(handler, sessionOptions)
