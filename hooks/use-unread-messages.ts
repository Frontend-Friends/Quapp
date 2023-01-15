import create from 'zustand'
import { Message } from '../components/message/type'

export const useUnreadMessages = create<{
  messages: Message[]
  setMessages: (newState: Message[]) => void
}>()((set) => ({
  messages: [],
  setMessages: (newState) => set(() => ({ messages: newState })),
}))
