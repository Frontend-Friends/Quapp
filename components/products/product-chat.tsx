import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { ChatMessage } from './types'

const mayHasDate = (
  entry: ChatMessage,
  history: ChatMessage[],
  index: number
) => {
  const lastEntry: ChatMessage | undefined = history[index - 1]
  const notSameDate =
    dayjs(entry.dateTime).format('DD/MM/YYYY') !==
    dayjs(lastEntry?.dateTime).format('DD/MM/YYYY')

  const isMoreThan2Hours = dayjs(entry.dateTime).diff(new Date(), 'hour') > 2

  if (index < 0 && isMoreThan2Hours) {
    return true
  }
  if (notSameDate) {
    return true
  }
  return false
}

export const ProductChat = ({
  history,
  productOwnerName,
  userName,
  isOwner,
}: {
  history: ChatMessage[]
  productOwnerName: string
  userName: string | null
  isOwner: boolean
}) => {
  return (
    <>
      {history.map((entry, index) => {
        const hasDate = mayHasDate(entry, history, index)
        const alignLeft = isOwner ? entry.fromOwner : !entry.fromOwner
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexFlow: 'column',
              '&:not(:first-of-type)': { mt: 2 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
              }}
            >
              {hasDate && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.disabled',
                  }}
                >
                  {dayjs(entry.dateTime).format('D.MM.YYYY, HH:MM:ss')}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  color: 'text.disabled',
                  ml: alignLeft ? 'auto' : undefined,
                  mr: !alignLeft ? 'auto' : undefined,
                }}
              >
                {entry.fromOwner ? productOwnerName : userName}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                ml: alignLeft ? 'auto' : 0,
                mr: alignLeft ? 0 : 'auto',
                maxWidth: '80%',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                borderTopLeftRadius: alignLeft ? undefined : 2,
                borderTopRightRadius: alignLeft ? 2 : undefined,
                textAlign: alignLeft ? 'right' : 'left',
                color: alignLeft ? 'primary.contrastText' : undefined,
                backgroundColor: alignLeft ? 'primary.main' : undefined,
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
