import { ChatMessage } from '../../components/products/types'

export const sortChatByTime = (chat: ChatMessage[]) => {
  return chat.sort((a, b) => {
    return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  })
}
