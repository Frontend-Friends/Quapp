import { Message } from '../message/type'
import { useTranslation } from '../../hooks/use-translation'
import dayjs from 'dayjs'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import React from 'react'

export const ProductMessage = ({
  message,
  onDecline,
  onAccept,
}: {
  message: Message
  onDecline: () => void
  onAccept: () => void
}) => {
  const t = useTranslation()
  return (
    <tr className="flex items-center gap-4 break-all">
      <td className="flex-grow">{message.userName}</td>
      <td className="flex justify-end">
        {dayjs(message.borrowDate).format('DD.MM.YYYY')}
      </td>
      <td className="flex justify-end">
        {message.status === 'replied' ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mintGreen-900 text-white">
            {message.accept ? <CheckIcon /> : <CloseIcon />}
          </div>
        ) : (
          <div>
            <IconButton onClick={onDecline} title={t('BORROW_REQUEST_accept')}>
              <CloseIcon />
            </IconButton>
            <IconButton onClick={onAccept} title={t('BORROW_REQUEST_decline')}>
              <CheckIcon />
            </IconButton>
          </div>
        )}
      </td>
    </tr>
  )
}
