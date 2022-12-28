import { NextApiRequest, NextApiResponse } from 'next'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { db } from '../../config/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { uploadFileToStorage } from '../../lib/scripts/upload-file-to-storage'
import { ProductFormData } from '../../components/products/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { fetchProduct } from '../../lib/services/fetch-product'
import { createNewCategory } from '../../lib/helpers/create_new_category'
import { deleteObjectKey } from '../../lib/helpers/delete-object-key'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { space } = req.query as { space: string }
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

    if (!!formData.fields.newCategory) {
      formData.fields.category = await createNewCategory(
        space,
        formData.fields.newCategory
      )
    }

    const imgSrc = await uploadFileToStorage(formData.files?.img)

    const docRef = collection(db, 'spaces', space, 'products')

    const [userRef] = getUserRef(user.id as string)

    deleteObjectKey(formData.fields, 'newCategory')

    const productId = await addDoc(docRef, {
      ...formData.fields,
      createdAt: new Date().getTime(),
      imgSrc,
      isAvailable: true,
      owner: userRef,
    }).then((r) => r.id)

    const productData = await fetchProduct(space, productId, user.id || '')

    res.status(200).json({ isOk: true, productId, product: productData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ isOk: false })
  }
}

export default withIronSessionApiRoute(createProduct, sessionOptions)
