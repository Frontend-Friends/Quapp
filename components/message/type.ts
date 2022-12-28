import { ProductType } from '../products/types'

type BorrowRequestMessage = {
  productId: string
  space: string
  borrowDate: string
  accept: boolean
  product: ProductType | null
  requesterId: string
}

type BorrowResponseMessage = {
  productId: string
  space: string
  borrowDate: string
  accept: boolean
  product: ProductType | null
  productOwnerId: string
}

export type Message = {
  id: string
  read: boolean
  message: string
  date: string
  status: 'pending' | 'replied'
  userName: string
  type: 'borrowRequest' | 'borrowResponse'
} & BorrowRequestMessage &
  BorrowResponseMessage
