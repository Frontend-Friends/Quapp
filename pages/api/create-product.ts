import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { CreateProduct } from '../../components/products/types'
import { mockUsers } from '../../mock/mock-users'
import { db, storage } from '../../config/firebase'
import { addDoc, collection, doc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import path from 'path'
import * as fs from 'fs'

type FormData = {
  fields: Omit<CreateProduct, 'img'>
  files: { img: File }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

export default async function createProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [fabriceTobler] = await mockUsers()

  try {
    const form = new formidable.IncomingForm()

    const formData = await new Promise<FormData>((resolve, reject) =>
      form.parse(req, async (err, fields, files) => {
        if (err) reject(err)
        resolve({
          fields: { ...fields },
          files: { ...files },
        } as unknown as FormData)
      })
    )

    await createProductSchema.validate({
      ...formData.fields,
      ...formData.files,
    })

    const imgSrc: { current: null | string } = { current: null }

    if (formData.files.img && formData.files.img.originalFilename) {
      const filePath = path.join(formData.files.img.filepath)

      const fileBuffer = await fs.promises.readFile(filePath)

      const imgRef = ref(
        storage,
        `${new Date().getTime()}-${formData.files.img.originalFilename}`
      )

      await uploadBytes(imgRef, fileBuffer)

      imgSrc.current = await getDownloadURL(imgRef)
    }

    const docRef = collection(db, 'spaces', fabriceTobler.spaces[0], 'products')

    const userRef = doc(db, 'user', fabriceTobler.id)

    await addDoc(docRef, {
      ...formData.fields,
      imgSrc: imgSrc.current,
      isAvailable: true,
      owner: userRef,
    })

    res.status(200).json({ status: 'ok' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'not Ok' })
  }
}
