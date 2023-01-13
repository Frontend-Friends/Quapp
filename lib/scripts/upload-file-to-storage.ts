import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { supabase } from '../../config/supabase'

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

  const fileName = `${new Date().getTime()}-${img.originalFilename}`

  const { data: uploadData, error } = await supabase.storage
    .from('images')
    .upload(`public/${fileName}`, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
    })

  console.log(error)
  console.log(uploadData?.path)

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(`public/${fileName}`)

  return data.publicUrl
}
