import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { SpaceItemType } from '../../components/products/types'

export const fetchSpace = async (space: string) => {
  const spaceRef = doc(db, 'spaces', space as string)

  return getDoc(spaceRef).then((r) => ({
    id: r.id,
    ...r.data(),
  })) as Promise<SpaceItemType>
}
