import { getUserRef } from '../../lib/helpers/refs/get-user-ref'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Message } from '../../components/message/type'
import { useRouter } from 'next/router'
import { UseTranslationType } from '../../hooks/use-translation'

type RouterType = ReturnType<typeof useRouter>

export function messageListener(
  userId: string,
  push: RouterType['push'],
  t: UseTranslationType,
  setMessage: (state: Message[]) => void
) {
  const [, userPath] = getUserRef(userId)
  const messageCollection = collection(...userPath, 'messages')
  const q = query(messageCollection, where('read', '==', false))
  return onSnapshot(q, (docs) => {
    setMessage(
      docs.docs.length
        ? docs.docs.map(
            (doc) =>
              ({
                id: doc.id,
                date: doc.id,
                ...doc.data(),
              } as Message)
          )
        : []
    )
  })
}
