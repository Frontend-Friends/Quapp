import { File } from 'formidable'
import fs from 'fs'

export const uploadFileToStorage = async (img?: File | null) => {
  if (!img || !img.originalFilename) {
    return null
  }
  const filePath = img.filepath

  const fileBuffer = await fs.promises.readFile(filePath)

  throw Error(fileBuffer.toString())
  return null
  /*

  const imgRef = ref(storage, `${new Date().getTime()}-${img.originalFilename}`)

  await uploadBytes(imgRef, fileBuffer)

  return getDownloadURL(imgRef)
*/
}
