import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchProduct } from '../../lib/services/fetch-product'
import { fetchUser } from '../../lib/services/fetch-user'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session

    if (!user) {
      throw Error('no User logged in')
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

    res.status(200).json({
      ok: true,
      userName: userData?.userName || null,
      product: product || null,
    })
  } catch {
    res.status(500).json({
      ok: false,
    })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
