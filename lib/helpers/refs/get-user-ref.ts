import { doc, DocumentReference } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { RefPath } from './type'

export const getUserRef = (id: string) => {
  const path: RefPath = [db, 'user', id]
  return [doc(...path), path] as [DocumentReference, RefPath]
}
