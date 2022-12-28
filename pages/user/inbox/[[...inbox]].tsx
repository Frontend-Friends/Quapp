import { CondensedContainer } from '../../../components/condensed-container'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../config/session-config'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchJson } from '../../../lib/helpers/fetch-json'
import { Message } from '../../../components/message/type'
import { MessageDrawer } from '../../../components/message/message-drawer'
import { MessageLink } from '../../../components/message/message-link'
import { fetchUser } from '../../../lib/services/fetch-user'
import { fetchProduct } from '../../../lib/services/fetch-product'

export const getServerSideProps: GetServerSideProps<{ messages?: Message[] }> =
  withIronSessionSsr(async ({ req }) => {
    const user = req.session.user
    if (!user || !user.id) {
      return { notFound: true }
    }
    const messageCollection = collection(db, 'user', user.id, 'messages')

    const messagesRef = await getDocs(messageCollection)

    const messages = await Promise.all<Message>(
      messagesRef.docs.map(
        (item) =>
          new Promise(async (resolve) => {
            const message = {
              id: item.id,
              date: item.id,
              ...item.data(),
            } as Message

            const product =
              message.type === 'borrowRequest'
                ? await fetchProduct(message.space, message.productId)
                : null

            console.log(message.productId, message.space)

            const requester = await fetchUser(message.requesterId)
            return resolve({
              ...message,
              userName: requester.userName || '',
              product: product || null,
            })
          })
      )
    )

    messages.sort((a, b) => b.date.localeCompare(a.date))

    return { props: { messages } }
  }, sessionOptions)

export default function Inbox({
  messages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query, push } = useRouter()
  const [mutateMessages, setMutateMessages] = useState(messages)
  const [message, setMessage] = useState<Message | undefined>(undefined)

  useEffect(() => {
    const messageDelay = setTimeout(async () => {
      if (message && !message.read) {
        await fetchJson('/api/update-message', {
          method: 'POST',
          body: JSON.stringify({ id: message.id, read: true }),
        })
        setMutateMessages((state) => {
          const foundItem = state?.find((item) => item === message)
          if (foundItem) {
            foundItem.read = true
          }
          return state ? [...state] : state
        })
      }
    }, 2000)
    return () => {
      clearTimeout(messageDelay)
    }
  }, [message])

  useEffect(() => {
    const foundItem = mutateMessages?.find(
      (item) => item.date === (query.inbox as string[] | undefined)?.[0]
    )
    setMessage(foundItem)
  }, [mutateMessages, query])

  const isOpen = useMemo(() => !!query.inbox, [query])

  const updateMessage = useCallback(async (updatedMessage: Message) => {
    setMessage(updatedMessage)
    setMutateMessages((state) => {
      const foundIndex =
        state?.findIndex((item) => item.date === updatedMessage.date) || -1
      if (foundIndex > -1 && state) {
        state[foundIndex] = updatedMessage
      }
      return state ? [...state] : state
    })
  }, [])

  return (
    <CondensedContainer>
      <h1>Inbox</h1>
      <ul className="grid gap-4">
        {mutateMessages?.map((entry, index) => {
          return (
            <li key={index}>
              <MessageLink
                message={entry}
                href={{ query: { ...query, inbox: entry.date } }}
              />
            </li>
          )
        })}
      </ul>
      <MessageDrawer
        open={isOpen}
        onClose={() => {
          push({ query: { ...query, inbox: undefined } })
        }}
        message={message}
        closeLink={{ query: { ...query, inbox: undefined } }}
        updateMessage={updateMessage}
      />
    </CondensedContainer>
  )
}
