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
  chats: ProductChat[]
}

export type ProductChat = {
  chatUserId: string
  chatUserName: string | null
  history: { dateTime: string; fromOwner: boolean; message: string }[]
}
