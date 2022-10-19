import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { ProductChatType } from './types'
import { useTranslation } from '../../hooks/use-translation'
import { ProductChat } from './product-chat'

export const ProductChats = ({
  chats,
  productOwnerName,
}: {
  chats: ProductChatType[]
  productOwnerName: string
}) => {
  const t = useTranslation()
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
      {chats.map((chat, index) => {
        return (
          <ProductChat
            key={index}
            productOwnerName={productOwnerName}
            history={chat.history}
            userName={chat.chatUserName}
          />
        )
      })}
    </Box>
  )
}
