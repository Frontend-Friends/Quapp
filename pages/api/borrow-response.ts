import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { arrayUnion, doc, setDoc } from 'firebase/firestore'
import { updateMessage } from '../../lib/services/update-message'
import { getProductRef } from '../../lib/helpers/refs/get-product-ref'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session

  try {
    if (!user || !user.id) {
      throw new Error('no User')
    }
    const { productId, space, messageId, accept, date, requesterId } =
      JSON.parse(req.body) as {
        requesterId: string
        productId: string
        space: string
        messageId: string
        accept: boolean
        date: string
      }

    const [prodRef] = getProductRef(space, productId)

    await updateMessage(user.id, {
      id: messageId,
      status: 'replied',
      accept,
      read: true,
    })

    if (accept) {
      await setDoc(prodRef, { borrowDates: arrayUnion(date) }, { merge: true })
    }

    const [, requesterPath] = getUserRef(requesterId)

    const messageRef = doc(
      ...requesterPath,
      'messages',
      new Date().getTime().toString()
    )

    await setDoc(messageRef, {
      space,
      productId,
      read: false,
      accept,
      type: 'borrowResponse',
      borrowDate: date,
      productOwnerId: user.id,
    })

    res.status(200).json({
      ok: true,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
