import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithoutRef } from 'react'
import {
  Box,
  IconButton,
  IconButtonProps,
  Modal,
  ModalUnstyledOwnProps,
} from '@mui/material'
import Link from 'next/link'
import CloseIcon from '@mui/icons-material/Close'
import { CondensedContainer } from './condensed-container'
import clsx from 'clsx'
import { Url } from 'url'
import { useTranslation } from '../hooks/use-translation'

const ModalCloseButton: FC<IconButtonProps> = ({ ...props }) => {
  const t = useTranslation()

  return (
    <IconButton
      {...props}
      title={t('BUTTON_close')}
      className="
      z-10
      -mt-2
      -mr-2
      h-12
      w-12
      border
      border-slate-200
      bg-white
      shadow
      hover:bg-slate-200"
    >
      <CloseIcon />
    </IconButton>
  )
}

const Overlay: FC<
  Omit<ModalUnstyledOwnProps, 'children'> &
    PropsWithoutRef<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    > & {
      containerProps?: PropsWithoutRef<
        DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
      >
      backUrl?: Url | string
      onCloseClick?: () => void
    }
> = ({ containerProps, backUrl, onCloseClick, ...props }) => {
  return (
    <Modal
      {...props}
      className={clsx(
        'flex items-center justify-center md:p-10',
        props.className
      )}
      disablePortal
    >
      <CondensedContainer
        {...containerProps}
        className={clsx(
          'absolute m-0 h-full max-h-full min-h-[30%] w-full overflow-auto bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:-translate-x-1/2 md:-translate-y-1/3',
          containerProps?.className
        )}
      >
        <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
          {backUrl ? (
            <Link href={backUrl} passHref shallow>
              <ModalCloseButton />
            </Link>
          ) : (
            <ModalCloseButton onClick={onCloseClick} />
          )}
        </Box>
        {props.children}
      </CondensedContainer>
    </Modal>
  )
}

export default Overlay
