import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { mockUsers } from '../../mock/mock-users'
import { db } from '../../config/firebase'
import { addDoc, collection, doc } from 'firebase/firestore'
import { uploadFileToStorage } from '../../lib/scripts/upload-file-to-storage'
import { ProductFormData } from '../../components/products/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session
    if (!user) {
      res.redirect('/login')
      return
    }
    const form = new formidable.IncomingForm()

    const formData = await new Promise<ProductFormData>((resolve, reject) =>
      form.parse(req, async (err, fields, files) => {
        if (err) reject(err)
        resolve({
          fields: { ...fields },
          files: { ...files },
        } as unknown as ProductFormData)
      })
    )

    await createProductSchema.validate({
      ...formData.fields,
      ...formData.files,
    })

    const imgSrc = await uploadFileToStorage(formData.files?.img)

    const docRef = collection(db, 'spaces', user.spaces[0], 'products')

    const userRef = doc(db, 'user', user.id)

    const productId = await addDoc(docRef, {
      ...formData.fields,
      imgSrc,
      isAvailable: true,
      owner: userRef,
    }).then((r) => r.id)

    res.status(200).json({ isOk: true, productId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ isOk: false })
  }
}

export default withIronSessionApiRoute(createProduct, sessionOptions)
