import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { sortChatByTime } from '../../lib/scripts/sort-chat-by-time'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function sendChat(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session

  const { space } = req.query

  if (!user) {
    res.redirect('/login')
    return
  }

  const formData = await parsedForm<{
    fields: {
      message: string
      productId: string
      fromOwner: boolean
      chatId: string
    }
  }>(req)

  const { productId, chatId } = formData.fields

  const docRef = doc(
    db,
    'spaces',
    (space as string) || '',
    'products',
    productId,
    'chats',
    chatId
  )

  const fetchedChat = await getDoc(docRef).then((r) => r.data())
  const currentHistory = fetchedChat?.history || []
  const history = [
    ...currentHistory,
    { dateTime: new Date().toISOString(), ...formData.fields },
  ].filter((item) => !!item)

  await setDoc(docRef, {
    history,
  })

  res.json({ isOk: true, history: sortChatByTime(history) })
}

export default withIronSessionApiRoute(sendChat, sessionOptions)