import { Alert, Box, Tab, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { ChatMessage, ProductChatType } from './types'
import { useTranslation } from '../../hooks/use-translation'
import { ProductChat } from './product-chat'
import { ChatForm } from '../chat-form'
import { User } from '../user/types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useRouter } from 'next/router'
import { subScribeChats } from '../../lib/services/chats-listener'

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
  space,
}: {
  userName: string
  isOwner: boolean
  userId: User['id']
  chats: ProductChatType[]
  productOwnerName: string
  space: string
}) => {
  const t = useTranslation()
  const [selectedChats, setSelectedChats] = useState(
    filteredChats(chats, userId, isOwner)
  )

  const { query } = useRouter()
  const [productId] = query.products as string[]

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

  useEffect(() => {
    if (isOwner || !selectedChats[0]?.chatUserId) {
      return
    }
    setSelectedTab(selectedChats[0].chatUserId)
  }, [selectedChats, isOwner])

  useEffect(() => {
    if (!isOwner && !selectedTab) {
      return
    }
    const chatId = isOwner ? selectedTab : userId

    const unsubscribe = subScribeChats(
      space as string,
      chatId || '',
      productId,
      setSelectedChats,
      updateChat,
      selectedTab
    )

    return () => {
      unsubscribe()
    }
  }, [updateChat, productId, query, selectedTab, isOwner, userId, space])

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
                    className="mr-1 rounded-tr-xl rounded-tl-xl bg-slate-200"
                  />
                )
              })}
            </TabList>
          )}

          {selectedChats.map((chat, index) => {
            return (
              <TabPanel
                className="p-0 py-4"
                value={chat.chatUserId as string}
                key={index}
              >
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
