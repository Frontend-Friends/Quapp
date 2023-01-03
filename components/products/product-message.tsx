import { Message } from '../message/type'
import { useTranslation } from '../../hooks/use-translation'
import dayjs from 'dayjs'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import React from 'react'
import clsx from 'clsx'

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
    <tr className="hover:bg-slate-100">
      <td className="py-1">{message.userName}</td>
      <td className="py-1 text-slate-400">
        {dayjs(message.borrowDate).format('DD.MM.YYYY')}
      </td>
      <td className="py-1">
        {message.status === 'replied' ? (
          <div
            className={clsx(
              'ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-white',
              message.accept ? 'bg-mintGreen-900' : 'bg-red-400'
            )}
          >
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
