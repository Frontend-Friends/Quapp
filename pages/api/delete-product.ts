import { NextApiRequest, NextApiResponse } from 'next'
import { doc, deleteDoc, getDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { db } from '../../config/firebase'
import { deleteFileInStorage } from '../../lib/scripts/delete-file-in-storage'
import { ProductType } from '../../components/products/types'

async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { space, productId } = req.query
    const { user } = req.session
    if (!user) {
      res.redirect('/auth/login')
      return
    }

    const productRef = doc(
      db,
      'spaces',
      space as string,
      'products',
      productId as string
    )

    const product = await getDoc(productRef).then(
      (r) =>
        ({
          id: r.id,
          ...r.data(),
        } as ProductType)
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
