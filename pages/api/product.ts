import { NextApiRequest, NextApiResponse } from 'next'
import { fetchProduct } from '../../lib/services/fetch-product'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { productId, space } = req.query
    try {
      const product = await fetchProduct(space as string, productId as string)

      res.status(200).json(product || null)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  sessionOptions
)
