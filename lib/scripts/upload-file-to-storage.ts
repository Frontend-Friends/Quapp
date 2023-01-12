import { File } from 'formidable'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import path from 'path'

export const uploadFileToStorage = async (img?: File | null) => {
  if (!img || !img.originalFilename) {
    return null
  }
  const filePath = img.filepath

  const fileBuffer = await fs.promises.readFile(filePath)

  const pathToFile = path.join(
    process.cwd(),
    `/public/images/${new Date().getTime()}-${img.originalFilename}`
  )

  await fs.promises.writeFile(pathToFile, fileBuffer)

  return pathToFile
}
