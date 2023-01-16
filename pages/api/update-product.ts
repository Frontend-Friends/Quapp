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
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { getQueryAsNumber } from '../../lib/helpers/get-query-as-number'

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
      console.error('No User')
      sendError(res)
      return
    }
    const formData = await parsedForm<ProductFormData>(req)

    const categories = []

    if (!!formData.fields.newCategory) {
      const fetchedCategories = await createNewCategory(
        space,
        formData.fields.newCategory
      )
      formData.fields.category = fetchedCategories.index
      categories.push(...fetchedCategories.categories)
    }

    deleteObjectKey(formData.fields, 'newCategory')

    await createProductSchema.validate({
      ...formData.fields,
      ...formData.files,
    })

    const imgSrc = await uploadFileToStorage(formData.files?.img)

    const [oldDoc, docRef] = await getProduct(id as string, space)

    const category =
      typeof formData.fields.category === 'string'
        ? getQueryAsNumber(formData.fields.category)
        : formData.fields.category

    const data = {
      ...formData.fields,
      category,
    } as Partial<ProductType>

    if (imgSrc) {
      await deleteFileInStorage(oldDoc.imgSrc)
      data.imgSrc = imgSrc
    }

    await setDoc(docRef, data, { merge: true })

    sendResponse(res, { product: { ...data }, categories })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(createProduct, sessionOptions)
