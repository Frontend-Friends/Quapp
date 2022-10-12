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
import dayjs from 'dayjs'
import { ProductChats } from './product-chats'

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
}: {
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
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { sm: 5 },
      }}
      disablePortal
    >
      {product ? (
        <CondensedContainer
          sx={{
            position: 'relative',
            backgroundColor: 'background.paper',
            p: 4,
            m: 0,
            maxHeight: '100%',
            overflow: 'auto',
            borderRadius: { sm: 2 },
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              height: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 10,
            }}
          >
            <Link href={backUrl} passHref shallow>
              <IconButton
                title={t('BUTTON_close')}
                sx={{
                  backgroundColor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  marginTop: -3,
                  marginRight: -3,
                  width: '48px',
                  height: '48px',
                }}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
            <Avatar
              alt="Remy Sharp"
              src="https://source.unsplash.com/random"
              sx={{ width: 56, height: 56 }}
            >
              RS
            </Avatar>
            <p>Remy Sharp</p>
          </Box>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {product.text}
          </Typography>
          <Box
            sx={{ position: 'relative', display: 'flex', flexFlow: 'column' }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                ml: 2,
                backgroundColor: 'background.paper',
                p: 1,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2"> {t('BUTTON_borrow')}</Typography>
            </Box>
            <Card variant="outlined" sx={{ mt: 2.5 }}>
              <CardContent>
                <BorrowForm onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </Box>
          <ProductChats
            chats={product.chats}
            productOwnerName={product.owner.userName}
          />
        </CondensedContainer>
      ) : (
        <CircularProgress />
      )}
    </Modal>
  )
}
