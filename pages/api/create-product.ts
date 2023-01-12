import { NextApiRequest, NextApiResponse } from 'next'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { ProductFormData } from '../../components/products/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { createNewCategory } from '../../lib/helpers/create_new_category'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'

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
      sendError(res)
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
    /*
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

    const productData = await fetchProduct(space, productId, user.id || '')*/

    sendResponse(res, { productId: 0, product: null })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(createProduct, sessionOptions)
