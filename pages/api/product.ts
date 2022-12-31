import { NextApiRequest, NextApiResponse } from 'next'
import { fetchProduct } from '../../lib/services/fetch-product'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { productId, space } = req.query
    try {
      const { user } = req.session
      if (!user) {
        throw Error('no user')
      }
      const product = await fetchProduct(
        space as string,
        productId as string,
        user.id || ''
      )

      sendResponse(res, product)
    } catch (err) {
      console.error(err)
      sendError(res)
    }
  },
  sessionOptions
)
