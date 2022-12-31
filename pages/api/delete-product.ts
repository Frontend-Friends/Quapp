import { NextApiRequest, NextApiResponse } from 'next'
import { deleteDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { deleteFileInStorage } from '../../lib/scripts/delete-file-in-storage'
import { getProduct } from '../../lib/services/get-product'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { space, productId } = req.query
    const { user } = req.session
    if (!user) {
      sendError(res)
      return
    }

    const [product, productRef] = await getProduct(
      productId as string,
      space as string
    )

    if (product.imgSrc) await deleteFileInStorage(product.imgSrc)

    await deleteDoc(productRef)

    sendResponse(res, { productId })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(deleteProduct, sessionOptions)
