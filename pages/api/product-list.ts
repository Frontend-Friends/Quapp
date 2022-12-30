import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { fetchProductList } from '../../lib/services/fetch-product-list'
import { getQueryAsNumber } from '../../lib/helpers/get-query-as-number'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { skip, space, filter } = req.query as {
      skip?: string
      space: string
      filter?: string
    }
    try {
      const productList = await fetchProductList(
        space,
        getQueryAsNumber(skip),
        filter === undefined ? undefined : getQueryAsNumber(filter)
      )

      sendResponse(res, {
        products: productList.products || [],
        count: productList.count,
      })
    } catch (err) {
      console.error(err)
      sendError(res)
    }
  },
  sessionOptions
)
