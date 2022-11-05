import { Box, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { ProductChatType } from './types'
import { useTranslation } from '../../hooks/use-translation'
import { ProductChat } from './product-chat'

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
  const selectedChats = useMemo(() => {
    return chats.filter((chat) => chat.chatUserId === userId || isOwner)
  }, [userId, isOwner, chats])
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
      {selectedChats.map((chat, index) => {
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
