import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const mockFabriceToblerId = 'jk1r8SXpX7mbCgy9WyCy'
const mockLaurentKerbageId = 'aUWzjKreyyXKGxXeCYor'

export const mockUsers = async () => {
  const fabriceToblerDoc = doc(db, 'user', mockFabriceToblerId)
  const laurentKerbageDoc = doc(db, 'user', mockLaurentKerbageId)

  return Promise.all<DocumentData>([
    getDoc(fabriceToblerDoc).then((r) => {
      return { ...r.data(), id: r.id }
    }),
    getDoc(laurentKerbageDoc).then((r) => {
      return { ...r.data(), id: r.id }
    }),
  ])
}
