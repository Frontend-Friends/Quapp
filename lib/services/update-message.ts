import { doc, setDoc } from 'firebase/firestore'
import { Message } from '../../components/message/type'
import { getUserRef } from '../helpers/refs/get-user-ref'

export const updateMessage = async (userId: string, data: Partial<Message>) => {
  const { id, ...rest } = data as Message

  const [, userPath] = getUserRef(userId)

  const messageRef = doc(...userPath, 'messages', id)

  await setDoc(messageRef, rest, { merge: true })
}
