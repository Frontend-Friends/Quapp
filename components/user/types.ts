export type User = {
  firstName: string
  email: string
  id: string | null
  uid: string
  phone?: string
  spaces?: string[]
  userName?: string
  lastName?: string
}

export type SettingType = Partial<User>
