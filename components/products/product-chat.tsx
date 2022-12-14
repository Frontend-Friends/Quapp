import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { ChatMessage } from './types'
import clsx from 'clsx'

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
                <Typography variant="body2" className="text-slate-400">
                  {dayjs(entry.dateTime).format('D.MM.YYYY, HH:MM:ss')}
                </Typography>
              )}
              <Typography
                variant="body2"
                className={clsx(
                  'text-slate-400',
                  alignLeft ? 'ml-auto' : 'mr-auto'
                )}
              >
                {entry.fromOwner ? productOwnerName : userName}
              </Typography>
            </Box>
            <Box
              className={clsx(
                'relative max-w-[80%] rounded border border-slate-200',
                alignLeft
                  ? 'ml-auto mr-0 rounded-tl rounded-tr bg-violetRed-600 text-right text-white'
                  : 'auto ml-0 text-left'
              )}
            >
              <Box className="p-4">{entry.message}</Box>
            </Box>
          </Box>
        )
      })}
    </>
  )
}
