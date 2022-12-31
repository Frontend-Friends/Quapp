import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchProduct } from '../../lib/services/fetch-product'
import { fetchUser } from '../../lib/services/fetch-user'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    if (!user) {
      sendError(res)
      return
    }
    const { userId, productId, space } = JSON.parse(req.body) as {
      userId: string
      productId: string
      space: string
    }

    const [userData, product] = await Promise.all([
      fetchUser(userId),
      fetchProduct(space, productId, userId),
    ])

    sendResponse(res, {
      userName: userData?.userName || null,
      product: product || null,
    })
  } catch (error) {
    console.error(error)
    sendError(res)
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
