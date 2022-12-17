import { File } from 'formidable'

export type ChatMessage = {
  dateTime: string
  fromOwner: boolean
  message: string
}

export type ProductChatType = {
  chatUserId: string | null
  chatUserName: string | null
  history: ChatMessage[]
}

export type ProductType = {
  id: string
  title: string
  text: string
  description?: string
  imgSrc?: string
  isAvailable: boolean
  owner: {
    id: string
    userName: string
  }
  createdAt: string
  chats: ProductChatType[]
}

export type SpaceItemType = {
  name: string
  id: string
  ownerId: string
  creatorId: string
  creationDate: Date
  memberCount: number
  itemCount: number
}

export type SignupType = {
  firstName: string
  email: string
  password: string
}

export type CreateProduct = Pick<
  ProductType,
  'title' | 'text' | 'description' | 'isAvailable'
> & { img?: File }

export type ProductFormData = {
  fields: Omit<CreateProduct, 'img'>
  files?: { img?: File | null } | null
}
