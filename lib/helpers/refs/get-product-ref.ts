import { doc, DocumentReference } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { RefPath } from './type'

export const getProductRef = (space: string, id: string) => {
  const path: RefPath = [db, 'spaces', space, 'products', id]
  return [doc(...path), path] as [DocumentReference, RefPath]
}
