import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { User } from '../components/user/types'

const mockFabriceToblerId = 'jk1r8SXpX7mbCgy9WyCy'
const mockLaurentKerbageId = 'REMNKUhwipVJmEStx84c'

export const mockUsers = async () => {
  const fabriceToblerDoc = doc(db, 'user', mockFabriceToblerId)
  const laurentKerbageDoc = doc(db, 'user', mockLaurentKerbageId)

  return Promise.all<User>([
    getDoc(fabriceToblerDoc).then((r) => {
      return { ...r.data(), id: r.id } as User
    }),
    getDoc(laurentKerbageDoc).then((r) => {
      return { ...r.data(), id: r.id } as User
    }),
  ])
}
