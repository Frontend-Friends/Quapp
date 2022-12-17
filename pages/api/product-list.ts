import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { fetchProductList } from '../../lib/services/fetch-product-list'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { skip, space } = req.query
    const skipNumber = isNaN(parseInt(skip as string))
      ? 0
      : parseInt(skip as string)
    try {
      const product = await fetchProductList(space as string, skipNumber)

      res.status(200).json(product || null)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  sessionOptions
)
