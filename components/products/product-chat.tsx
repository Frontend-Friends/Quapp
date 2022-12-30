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
          <Box key={index} className="mt-2 flex flex-col">
            <Box className="flex flex-col items-center">
              {hasDate && (
                <Typography
                  variant="body2"
                  className="mt-3 mb-1 text-slate-400"
                >
                  {dayjs(entry.dateTime).format('D. MMMM YYYY')}
                </Typography>
              )}
            </Box>
            <Box
              className={clsx(
                'relative max-w-[80%]',
                alignLeft
                  ? 'ml-auto mr-0 rounded-tl-lg rounded-tr-lg rounded-bl-lg bg-blueishGray-600 text-right text-white'
                  : 'auto ml-0 rounded-tl-lg rounded-tr-lg rounded-br-lg bg-slate-200 text-left'
              )}
            >
              <Box className="p-3">
                <p className="m-0">{entry.message}</p>
                <small className="text-xs text-blueishGray-200">
                  {dayjs(entry.dateTime).format('HH:MM')}
                </small>
              </Box>
            </Box>
          </Box>
        )
      })}
    </>
  )
}
