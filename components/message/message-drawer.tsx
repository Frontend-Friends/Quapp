import Link from 'next/link'
import { IconButton, Modal } from '@mui/material'
import { useTranslation } from '../../hooks/use-translation'
import { Message } from './type'
import { Url } from 'url'
import { BorrowRequestMessage } from './borrow-request-message'
import { BorrowResponseMessage } from './borrow-response-message'
import { CondensedContainer } from '../condensed-container'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

export const MessageDrawer = ({
  open,
  onClose,
  message,
  closeLink,
  updateMessage,
}: {
  open: boolean
  onClose: () => void
  message?: Message
  closeLink: Partial<Url>
  updateMessage: (message: Message) => void
}) => {
  const t = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center md:p-10"
    >
      <CondensedContainer className="absolute m-0 h-full w-full bg-white p-4 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/3">
        <Link href={closeLink} passHref shallow>
          <IconButton
            title={t('BUTTON_close')}
            className="absolute top-2 right-2 z-10 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
          >
            <CloseIcon />
          </IconButton>
        </Link>

        <h3 className="my-0 pr-10">
          {t('BORROW_message_title')}
          {`"${message?.product?.title}"`}
        </h3>

        {message && message.type === 'borrowRequest' && (
          <BorrowRequestMessage
            message={message}
            updateMessage={updateMessage}
          />
        )}
        {message && message.type === 'borrowResponse' && (
          <BorrowResponseMessage message={message} />
        )}
      </CondensedContainer>
    </Modal>
  )
}
