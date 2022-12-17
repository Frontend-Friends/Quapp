import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { fetchProductList } from '../../lib/services/fetch-product-list'
import { getQueryAsNumber } from '../../lib/helpers/get-query-as-number'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { skip, space } = req.query
    try {
      const productList = await fetchProductList(
        space as string,
        getQueryAsNumber(skip)
      )

      res.status(200).json({
        ok: true,
        products: productList.products || [],
        count: productList.count,
      })
    } catch (err) {
      res.status(500).json({ ok: false, message: 'SERVER_error' })
    }
  },
  sessionOptions
)
