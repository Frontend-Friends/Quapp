import { CondensedContainer } from '../../../components/condensed-container'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../config/session-config'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchJson } from '../../../lib/helpers/fetch-json'
import { MessageDetail } from '../../../components/message/message-detail'
import { MessageLink } from '../../../components/message/message-link'
import { fetchMessages } from '../../../lib/services/fetch-messages'
import { useAsync } from 'react-use'
import { Header } from '../../../components/header'
import { useTranslation } from '../../../hooks/use-translation'

export const getServerSideProps: GetServerSideProps<{
  messages?: MessageDetail[]
}> = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user
  if (!user || !user.id) {
    return { notFound: true }
  }
  const messages = await fetchMessages(user.id)

  return { props: { messages } }
}, sessionOptions)

export default function Inbox({
  messages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query, push } = useRouter()
  const [mutateMessages, setMutateMessages] = useState(messages)
  const [message, setMessage] = useState<MessageDetail | undefined>(undefined)
  const [requestInterval, setRequestInterval] = useState(0)

  useAsync(async () => {
    const { messages: fetchedMessages, ok } = await fetchJson<{
      messages: MessageDetail[]
    }>('/api/messages')
    if (ok) {
      setMutateMessages(fetchedMessages)
    }
    const delay = setTimeout(() => {
      setRequestInterval(requestInterval + 1)
    }, 5000)
    return () => {
      clearTimeout(delay)
    }
  }, [requestInterval])

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

  const updateMessage = useCallback(async (updatedMessage: MessageDetail) => {
    setMutateMessages((state) => {
      const foundIndex = state?.findIndex(
        (item) => item.date === updatedMessage.date
      )
      if (foundIndex !== undefined && foundIndex > -1 && state) {
        state[foundIndex] = updatedMessage
      }
      return state ? [...state] : state
    })
  }, [])

  const t = useTranslation()

  return (
    <CondensedContainer>
      <Header title={t('INBOX_title')} titleSpacingClasses="mb-4" />
      <ul className="grid list-none gap-4 p-0">
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
      <MessageDetail
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
