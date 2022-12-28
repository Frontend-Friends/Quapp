import { doc, DocumentReference } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { RefPath } from './type'

export const getSpaceRef = (space: string) => {
  const path: RefPath = [db, 'spaces', space as string]
  return [doc(...path), path] as [DocumentReference, RefPath]
}
