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
import { createNewCategory } from '../../lib/helpers/create_new_category'
import { deleteObjectKey } from '../../lib/helpers/delete-object-key'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { space, id } = req.query as { space: string; id: string }
    const { user } = req.session
    if (!user) {
      res.redirect('/auth/login')
      return
    }
    const formData = await parsedForm<ProductFormData>(req)

    if (!!formData.fields.newCategory) {
      formData.fields.category = await createNewCategory(
        space,
        formData.fields.newCategory
      )
    }

    deleteObjectKey(formData.fields, 'newCategory')

    await createProductSchema.validate({
      ...formData.fields,
      ...formData.files,
    })

    const imgSrc = await uploadFileToStorage(formData.files?.img)

    const [oldDoc, docRef] = await getProduct(id as string, space)

    const data = {
      ...formData.fields,
    } as Omit<ProductType, 'id' | 'owner' | 'chats' | 'createdAt'>

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
