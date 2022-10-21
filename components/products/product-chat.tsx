import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { ChatMessage } from './types'

export const ProductChat = ({
  history,
  productOwnerName,
  userName,
}: {
  history: ChatMessage[]
  productOwnerName: string
  userName: string | null
}) => {
  return (
    <>
      {history.map((entry, index) => {
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexFlow: 'column',
              '&:not(:first-child)': { mt: 2 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.disabled',
                }}
              >
                {dayjs(entry.dateTime).format('D.MM.YYYY, HH:MM:ss')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  order: entry.fromOwner ? undefined : -1,
                  color: 'text.disabled',
                }}
              >
                {entry.fromOwner ? productOwnerName : userName}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                ml: entry.fromOwner ? 'auto' : 0,
                mr: entry.fromOwner ? 0 : 'auto',
                maxWidth: '80%',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                borderTopLeftRadius: entry.fromOwner ? undefined : 2,
                borderTopRightRadius: entry.fromOwner ? 2 : undefined,
                textAlign: entry.fromOwner ? 'right' : 'left',
                color: entry.fromOwner ? 'primary.contrastText' : undefined,
                backgroundColor: entry.fromOwner ? 'primary.main' : undefined,
              }}
            >
              <Box sx={{ p: 2 }}>{entry.message}</Box>
            </Box>
          </Box>
        )
      })}
    </>
  )
}
