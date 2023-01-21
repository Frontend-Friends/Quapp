import { useTranslation } from '../../hooks/use-translation'
import { Message } from './type'
import { Url } from 'url'
import { BorrowRequestMessage } from './borrow-request-message'
import { BorrowResponseMessage } from './borrow-response-message'
import React from 'react'
import Overlay from '../overlay'

export const MessageDetail = ({
  open,
  onClose,
  message,
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
    <Overlay open={open} onClose={onClose} onCloseClick={onClose}>
      <h3 className="my-0 pr-10">
        {t('BORROW_message_title')}
        {`"${message?.product?.title}"`}
      </h3>

      {message && message.type === 'borrowRequest' && (
        <BorrowRequestMessage message={message} updateMessage={updateMessage} />
      )}
      {message && message.type === 'borrowResponse' && (
        <BorrowResponseMessage message={message} />
      )}
    </Overlay>
  )
}
