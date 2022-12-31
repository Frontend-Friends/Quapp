import Link from 'next/link'
import { Drawer, IconButton } from '@mui/material'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { useTranslation } from '../../hooks/use-translation'
import { Message } from './type'
import { Url } from 'url'
import { BorrowRequestMessage } from './borrow-request-message'
import { BorrowResponseMessage } from './borrow-response-message'

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
    <Drawer
      anchor="right"
      variant="persistent"
      open={open}
      onClose={onClose}
      className="h-full overflow-auto"
    >
      <div className="w-screen p-4 md:w-full">
        <span className="flex items-center gap-2">
          <Link href={closeLink} passHref shallow>
            <IconButton component="a" title={t('BUTTON_close')}>
              <ChevronLeft />
            </IconButton>
          </Link>
          <h2>
            {t('BORROW_message_title')}
            {`"${message?.product?.title}"`}
          </h2>
        </span>
        {message && message.type === 'borrowRequest' && (
          <BorrowRequestMessage
            message={message}
            updateMessage={updateMessage}
          />
        )}
        {message && message.type === 'borrowResponse' && (
          <BorrowResponseMessage message={message} />
        )}
      </div>
    </Drawer>
  )
}
