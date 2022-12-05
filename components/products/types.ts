import { File } from 'formidable'

export type ChatMessage = {
  dateTime: string
  fromOwner: boolean
  message: string
}

export type ProductChatType = {
  chatUserId: string
  chatUserName: string | null
  history: ChatMessage[]
}

export type ProductType = {
  id: string
  title: string
  lead?: string
  text: string
  description?: string
  imgSrc?: string
  isAvailable: boolean
  owner: {
    id: string
    userName: string
  }
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

export type CreateProduct = Pick<
  ProductType,
  'title' | 'lead' | 'text' | 'description' | 'isAvailable'
> & { img?: File }

export type ProductFormData = {
  fields: Omit<CreateProduct, 'img'>
  files?: { img?: File | null } | null
}
