import { File } from 'formidable'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../config/firebase'
import path from 'path'

export const uploadFileToStorage = async (img?: File | null) => {
  if (!img || !img.originalFilename) {
    return null
  }
  const filePath = path.join(
    process.cwd(),
    'public',
    'android-chrome-192x192.png'
  )

  const fileBuffer = await fs.promises.readFile(filePath)

  const imgRef = ref(storage, `${new Date().getTime()}-${img.originalFilename}`)

  await uploadBytes(imgRef, fileBuffer)

  return getDownloadURL(imgRef)
}
