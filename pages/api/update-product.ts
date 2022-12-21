import { NextApiRequest, NextApiResponse } from 'next'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { setDoc } from 'firebase/firestore'
import { uploadFileToStorage } from '../../lib/scripts/upload-file-to-storage'
import { ProductFormData, ProductType } from '../../components/products/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { deleteFileInStorage } from '../../lib/scripts/delete-file-in-storage'
import { getProduct } from '../../lib/services/get-product'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { space, id } = req.query
    const { user } = req.session
    if (!user) {
      res.redirect('/auth/login')
      return
    }
    const formData = await parsedForm<ProductFormData>(req)

    await createProductSchema.validate({
      ...formData.fields,
      ...formData.files,
    })

    const imgSrc = await uploadFileToStorage(formData.files?.img)

    const [oldDoc, docRef] = await getProduct(id as string, space as string)

    const data = {
      ...formData.fields,
    } as ProductType

    if (imgSrc) {
      await deleteFileInStorage(oldDoc.imgSrc)
      data.imgSrc = imgSrc
    }

    await setDoc(docRef, data, { merge: true })

    res.status(200).json({ isOk: true, product: { ...data } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ isOk: false })
  }
}

export default withIronSessionApiRoute(createProduct, sessionOptions)
