import { ProductType } from '../products/types'

type BorrowRequestMessage = {
  type: 'borrowRequest'
  productId: string
  space: string
  borrowDate: string
  accept: boolean
  product: ProductType | null
}

export type Message = {
  id: string
  read: boolean
  message: string
  date: string
  type: 'borrowRequest'
  status: 'pending' | 'replied'
  requesterId: string
  userName: string
} & BorrowRequestMessage
