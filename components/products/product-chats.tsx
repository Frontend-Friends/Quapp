import { Alert, Box, Tab, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { ChatMessage, ProductChatType } from './types'
import { useTranslation } from '../../hooks/use-translation'
import { ProductChat } from './product-chat'
import { ChatForm } from '../chat-form'
import { User } from '../user/types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useAsync } from 'react-use'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useRouter } from 'next/router'

const filteredChats = (
  chats: ProductChatType[],
  userId: User['id'],
  isOwner: boolean
) => {
  return chats.filter((chat) => chat.chatUserId === userId || isOwner)
}

export const ProductChats = ({
  userName,
  userId,
  isOwner,
  chats,
  productOwnerName,
}: {
  userName: string
  isOwner: boolean
  userId: User['id']
  chats: ProductChatType[]
  productOwnerName: string
}) => {
  const t = useTranslation()
  const [selectedChats, setSelectedChats] = useState(
    filteredChats(chats, userId, isOwner)
  )

  const { query } = useRouter()
  const [productId] = query.products as string[]
  const [fetchCount, setFetchCount] = useState(0)

  const [selectedTab, setSelectedTab] = useState(selectedChats[0]?.chatUserId)

  const updateChat = useCallback(
    (chatId: string | null) => {
      return (history: ChatMessage[]) => {
        setSelectedChats((state) => {
          const foundIndex = state.findIndex(
            (item) => item.chatUserId === chatId
          )
          if (foundIndex > -1) {
            state[foundIndex] = { ...state[foundIndex], history }
          } else {
            state.push({ chatUserId: chatId, chatUserName: userName, history })
          }
          return [...state]
        })
      }
    },
    [userName]
  )

  useAsync(async () => {
    if (!isOwner && !selectedTab) {
      return
    }
    const chatId = isOwner ? selectedTab : userId

    const fetchedChat = await fetchJson<{
      history: ChatMessage[]
      userId: string | null
      chats: ProductChatType[]
    }>(
      `/api/chats?productId=${productId}&space=${query.space}&chatId=${
        chatId || ''
      }`
    )

    if (fetchedChat.chats.length) {
      setSelectedChats(fetchedChat.chats)
    } else {
      const selectedChatId = selectedTab || fetchedChat.userId
      updateChat(selectedChatId)(fetchedChat.history)
    }

    const timeout = setTimeout(() => {
      setFetchCount(fetchCount + 1)
    }, 5000)
    return () => {
      clearTimeout(timeout)
    }
  }, [updateChat, fetchCount, productId, query, selectedTab])

  return (
    <Box className="rounded border border-slate-200">
      <Typography variant="h2" className="mb-4">
        {t('CHAT_title')}
      </Typography>

      {!isOwner && (
        <ChatForm
          isOwner={isOwner}
          chatId={userId}
          setChat={updateChat(userId)}
        />
      )}
      {!selectedChats.length && (
        <Alert severity="info">{t('CHAT_no_messages')}</Alert>
      )}
      {!!selectedChats.length && (
        <TabContext value={selectedTab as string}>
          {isOwner && (
            <TabList
              onChange={(_, newValue) => {
                setSelectedTab(`${newValue}`)
              }}
            >
              {selectedChats.map((chat, index) => {
                return (
                  <Tab
                    label={chat.chatUserName}
                    value={chat.chatUserId}
                    key={index}
                  />
                )
              })}
            </TabList>
          )}

          {selectedChats.map((chat, index) => {
            return (
              <TabPanel value={chat.chatUserId as string} key={index}>
                <div>
                  {isOwner && (
                    <ChatForm
                      isOwner={isOwner}
                      chatId={chat.chatUserId}
                      setChat={updateChat(chat.chatUserId)}
                    />
                  )}
                  <ProductChat
                    productOwnerName={productOwnerName}
                    history={chat.history}
                    userName={chat.chatUserName}
                    isOwner={isOwner}
                  />
                </div>
              </TabPanel>
            )
          })}
        </TabContext>
      )}
    </Box>
  )
}
