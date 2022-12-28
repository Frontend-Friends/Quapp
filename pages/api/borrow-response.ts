import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { arrayUnion, setDoc } from 'firebase/firestore'
import { updateMessage } from '../../lib/services/update-message'
import { getProductRef } from '../../lib/helpers/refs/get-product-ref'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session

  try {
    if (!user || !user.id) {
      throw new Error('no User')
    }
    const { productId, space, messageId, accept, date } = JSON.parse(
      req.body
    ) as {
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

    // const requester = await fetchUser(userId)

    res.status(200).json({
      ok: true,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
