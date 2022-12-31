import { Firestore } from 'firebase/firestore'

export type RefPath = [db: Firestore, path: string, ...pathSegments: string[]]
