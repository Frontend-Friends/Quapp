import { File } from 'formidable'
import fs from 'fs'
import { supabase } from '../../config/supabase'

export const uploadFileToStorage = async (img?: File | null) => {
  if (!img || !img.originalFilename) {
    return null
  }

  const fileBuffer = await fs.promises.readFile(img.filepath)

  const fileName = `${new Date().getTime()}-${img.originalFilename}`

  await supabase.storage
    .from('images')
    .upload(`public/${fileName}`, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
    })

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(`public/${fileName}`)

  return data.publicUrl
}
