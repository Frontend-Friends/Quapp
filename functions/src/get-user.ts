import { getRef } from './get-ref'
import { app } from './admin'
import { DocumentData } from 'firebase-admin/firestore'

const store = app.firestore()

export const getUser = async (id: string) =>
  store
    .doc(getRef('user', id))
    .get()
    .then((r) => ({ id: r.id, ...r.data() } as DocumentData))
