import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { ChatMessage, ProductChatType } from './types'
import { useTranslation } from '../../hooks/use-translation'
import { ProductChat } from './product-chat'
import { Formik } from 'formik'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { useRouter } from 'next/router'

export const ChatForm = ({
  isOwner,
  chatId,
  setChat,
}: {
  isOwner: boolean
  chatId: string
  setChat?: (chat: ChatMessage[]) => void
}) => {
  const t = useTranslation()
  const { query } = useRouter()
  const [productId] = query.products as string[]
  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={async (values) => {
        const result = await sendFormData<{
          isOk: boolean
          history: ChatMessage[]
        }>('/api/send-chat', {
          productId,
          chatId,
          fromOwner: isOwner,
          ...values,
        })
        if (result.isOk && setChat) {
          setChat(result.history)
        }
      }}
    >
      {({ values, handleSubmit, handleBlur, handleChange }) => (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
          <TextField
            label={t('CHAT_message')}
            defaultValue={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            name="message"
          />
          <Button type="submit" variant="contained" color="secondary">
            {t('CHAT_button_send')}
          </Button>
        </form>
      )}
    </Formik>
  )
}

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
