import { File } from 'formidable'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../config/firebase'

export const uploadFileToStorage = async (img?: File | null) => {
  if (!img || !img.originalFilename) {
    return null
  }
  const filePath = img.filepath

  const fileBuffer = await fs.promises.readFile(filePath)

  const imgRef = ref(storage, `${new Date().getTime()}-${img.originalFilename}`)

  console.error(filePath)
  console.error(fileBuffer.toString())

  await uploadBytes(imgRef, fileBuffer)

  return getDownloadURL(imgRef)
}
