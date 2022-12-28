import { DocumentReference } from 'firebase/firestore'

export type User = {
  firstName: string
  email: string
  id: string | null
  uid: string
  phone?: string
  spaces?: string[]
  requestedProducts?: DocumentReference[]
  userName?: string
  lastName?: string
}

export type SettingType = Partial<User>
