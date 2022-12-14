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
          <Box key={index} className="&:not(:first-of-type:mt-4) flex flex-col">
            <Box className="flex flex-col items-center">
              {hasDate && (
                <Typography variant="body2" className="text-[text.disabled]">
                  {dayjs(entry.dateTime).format('D.MM.YYYY, HH:MM:ss')}
                </Typography>
              )}
              <Typography
                variant="body2"
                className={`text-[text.disabled] ml-${
                  alignLeft ? 'auto' : undefined
                } mr-${!alignLeft ? 'auto' : undefined}`}
              >
                {entry.fromOwner ? productOwnerName : userName}
              </Typography>
            </Box>
            <Box
              className={`border-[divider] relative max-w-[80%] rounded border ml-${
                alignLeft ? 'auto' : 0
              } mr-${alignLeft ? 0 : 'auto'} ${
                alignLeft ? undefined : 'rounded-tl'
              } ${alignLeft ? 'rounded-tr' : undefined} text-[${
                alignLeft ? 'right' : 'left'
              }] text-[${alignLeft ? 'primary.contrastText' : undefined}] bg-[${
                alignLeft ? 'primary.main' : undefined
              }]`}
            >
              <Box className="p-4">{entry.message}</Box>
            </Box>
          </Box>
        )
      })}
    </>
  )
}
