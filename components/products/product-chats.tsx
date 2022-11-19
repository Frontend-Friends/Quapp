import { Box, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { ChatMessage, ProductChatType } from './types'
import { useTranslation } from '../../hooks/use-translation'
import { ProductChat } from './product-chat'
import { ChatForm } from '../chat-form'

export const ProductChats = ({
  userId,
  isOwner,
  chats,
  productOwnerName,
}: {
  isOwner: boolean
  userId: string
  chats: ProductChatType[]
  productOwnerName: string
}) => {
  const t = useTranslation()
  const [selectedChats, setSelectedChats] = useState(
    chats.filter((chat) => chat.chatUserId === userId || isOwner)
  )

  const updateChat = useCallback((chatId: string) => {
    return (history: ChatMessage[]) => {
      setSelectedChats((state) => {
        const foundIndex = state.findIndex((item) => item.chatUserId === chatId)
        if (foundIndex > -1) {
          state[foundIndex] = { ...state[foundIndex], history }
        }
        return [...state]
      })
    }
  }, [])

  return (
    <Box
      sx={{
        p: 3,
        mt: 2,
        border: 1,
        borderRadius: 2,
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6">{t('CHAT_title')}</Typography>
      {!isOwner && (
        <ChatForm
          isOwner={isOwner}
          chatId={userId}
          setChat={updateChat(userId)}
        />
      )}
      {selectedChats.map((chat, index) => {
        return (
          <div key={index}>
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
        )
      })}
    </Box>
  )
}
