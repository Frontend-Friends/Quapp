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

export type CreateProduct = Pick<
  ProductType,
  'title' | 'lead' | 'text' | 'description'
> & { img?: File }

export type ProductFormData = {
  fields: Omit<CreateProduct, 'img'>
  files?: { img?: File | null } | null
}
