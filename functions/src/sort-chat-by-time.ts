import { DocumentData } from 'firebase-admin/firestore'

export const sortChatByTime = (chat: DocumentData[]) => {
  return chat.sort((a, b) => {
    return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  })
}
