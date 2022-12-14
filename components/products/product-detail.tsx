import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import Link from 'next/link'
import CloseIcon from '@mui/icons-material/Close'
import { Header } from '../header'
import { BorrowForm, OnBorrowSubmit } from '../borrow-form'
import { ProductType } from './types'
import { ProductChats } from './product-chats'
import { User } from '../user/types'

const handleSubmit: OnBorrowSubmit = async (values, setSubittming) => {
  const fetchedData = await fetch('/api/borrow', {
    method: 'POST',
    body: JSON.stringify(values),
  })
    .then((r) => r.json())
    .then((r) => r)

  if (fetchedData.status === 500) {
    return
  }
  setSubittming(false)
}

export const ProductDetail = ({
  product,
  userId,
}: {
  userId?: User['id']
  product?: ProductType | null
}) => {
  const { asPath, query, push } = useRouter()

  const backUrl = useMemo(() => {
    const queryString = (query.products as string[])?.join('/')

    return queryString ? asPath.replace(`/${queryString}`, '') : asPath
  }, [asPath, query])

  const modalIsOpen = useMemo(() => {
    return !!query.products
  }, [query])

  const t = useTranslation()
  return (
    <Modal
      open={modalIsOpen}
      onClose={() => {
        push(backUrl, undefined, { shallow: true })
      }}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="flex items-center justify-center sm:p-10"
      disablePortal
    >
      {product ? (
        <CondensedContainer className="bg-[background.paper] relative m-0 max-h-full overflow-auto p-8 sm:rounded">
          <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
            <Link href={backUrl} passHref shallow>
              <IconButton
                title={t('BUTTON_close')}
                className="bg-[background.paper] border-[divider] -mt-6 -mr-6 h-12 w-12 border"
              >
                <CloseIcon />
              </IconButton>
            </Link>
          </Box>
          <Header
            title={product.title}
            lead={product.lead}
            imgSrc={product.imgSrc}
          />
          <Box className="flex items-center gap-4 py-8">
            <Avatar alt={product.owner.userName} src="" className="h-14 w-14">
              {product.owner.userName?.slice(0, 2)}
            </Avatar>
            <p>{product.owner.userName}</p>
          </Box>
          <Typography variant="body1" className="mb-8">
            {product.text}
          </Typography>
          {userId !== product.owner.id && (
            <Box className="relative flex flex-col">
              <Box className="bg-[background.paper] border-[divider] absolute top-0 ml-4 rounded border p-2">
                <Typography variant="body2"> {t('BUTTON_borrow')}</Typography>
              </Box>
              <Card variant="outlined" className="mt-6">
                <CardContent>
                  <BorrowForm onSubmit={handleSubmit} />
                </CardContent>
              </Card>
            </Box>
          )}
          {userId && (
            <ProductChats
              isOwner={product.owner.id === userId}
              chats={product.chats}
              userId={userId}
              productOwnerName={product.owner.userName}
            />
          )}
        </CondensedContainer>
      ) : (
        <CircularProgress />
      )}
    </Modal>
  )
}
