import { NextApiRequest, NextApiResponse } from 'next'
import { deleteDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { deleteFileInStorage } from '../../lib/scripts/delete-file-in-storage'
import { getProduct } from '../../lib/services/get-product'

async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { space, productId } = req.query
    const { user } = req.session
    if (!user) {
      res.redirect('/auth/login')
      return
    }

    const [product, productRef] = await getProduct(
      productId as string,
      space as string
    )

    if (product.imgSrc) await deleteFileInStorage(product.imgSrc)

    await deleteDoc(productRef)

    res.status(200).json({ isOk: true, productId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ isOk: false })
  }
}

export default withIronSessionApiRoute(deleteProduct, sessionOptions)