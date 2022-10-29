import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { CreateProduct } from '../../components/products/types'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

export default async function createProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const form = new formidable.IncomingForm()

    const fieldData = await new Promise<CreateProduct>((resolve, reject) =>
      form.parse(req, async (err, fields, files) => {
        if (err) reject(err)
        resolve({ ...fields, ...files } as unknown as CreateProduct)
      })
    )

    await createProductSchema.validate({ ...fieldData })

    res.status(200).json({ status: 'ok' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'not Ok' })
  }
}
