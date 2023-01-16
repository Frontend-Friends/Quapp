import { getRef } from './get-ref'
import { app } from './admin'
import { DocumentData } from 'firebase-admin/firestore'

export const getSpace = async (space: string) => {
  const spaceRef = getRef('spaces', space)

  return app
    .firestore()
    .doc(spaceRef)
    .get()
    .then((r) => ({
      id: r.id,
      ...r.data(),
    })) as Promise<DocumentData>
}
