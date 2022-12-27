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
  category: number | string
  createdAt: string
  chats: ProductChatType[]
}

export type SpaceItemType = {
  name: string
  id?: string
  ownerId?: string
  creatorId?: string
  creationDate?: Date
  memberCount?: number
  itemCount?: number
  categories?: string[]
  spaces?: string[]
}

export type SignupType = {
  firstName: string
  email: string
  password: string
}
export type SpaceFormData = {
  fields: SpaceItemType
}

export type CreateProduct = Pick<
  ProductType,
  'title' | 'text' | 'description' | 'isAvailable' | 'category'
> & { img?: File; newCategory: string }

export type ProductFormData = {
  fields: Omit<CreateProduct, 'img'>
  files?: { img?: File | null } | null
}
