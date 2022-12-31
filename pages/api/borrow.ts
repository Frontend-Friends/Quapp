import { NextApiRequest, NextApiResponse } from 'next'
import { doc, setDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { BorrowProductType } from '../../components/products/types'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    if (!user || !user.id) {
      sendError(res)
      return
    }

    const parsedValue = await parsedForm<{ fields: BorrowProductType }>(
      req
    ).then((r) => ({
      ...r.fields,
      borrowRequester: user.id,
      status: 'pending',
    }))

    const [, userRef] = getUserRef(parsedValue.productOwner)

    const messageRef = doc(
      ...userRef,
      'messages',
      new Date().getTime().toString()
    )

    await setDoc(messageRef, {
      borrowDate: parsedValue.borrowDate,
      productId: parsedValue.productId,
      requesterId: user.id,
      space: parsedValue.space,
      status: parsedValue.status,
      message: parsedValue.message,
      type: 'borrowRequest',
      read: false,
    })

    sendResponse(res)
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
