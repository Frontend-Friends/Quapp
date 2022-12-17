import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../../config/firebase'

export const deleteFileInStorage = async (src?: string | null) => {
  if (!src) {
    return
  }
  const fileRef = ref(storage, src)
  await deleteObject(fileRef)
}
