import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import {
  Avatar,
  Box,
  Card,
  CardContent,
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

export const ProductDetail = ({ product }: { product?: ProductType }) => {
  const { asPath, query, push } = useRouter()

  const backUrl = useMemo(() => {
    const queryString = (query.products as string[])?.join('/')

    return queryString ? asPath.replace(`/${queryString}`, '') : asPath
  }, [asPath, query])

  const modalIsOpen = useMemo(() => {
    return !!query.products
  }, [query])

  const t = useTranslation()
  return product ? (
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
        <Box sx={{ position: 'relative', display: 'flex', flexFlow: 'column' }}>
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
        <Box
          sx={{
            p: 3,
            mt: 2,
            border: 1,
            borderRadius: 2,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">{t('CHAT_title')}</Typography>
          {product.chats.map((chat, chatIndex) => {
            return chat.history.map((entry, entryIndex) => {
              return (
                <Box
                  key={`${chatIndex}${entryIndex}`}
                  sx={{
                    display: 'flex',
                    flexFlow: 'column',
                    '&:not(:first-child)': { mt: 2 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 4,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.disabled',
                      }}
                    >
                      {dayjs(entry.dateTime).format('D.MM.YYYY, HH:MM:ss')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        order: entry.fromOwner ? undefined : -1,
                        color: 'text.disabled',
                      }}
                    >
                      {entry.fromOwner
                        ? product.owner.userName
                        : chat.chatUserName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'relative',
                      ml: entry.fromOwner ? 'auto' : 0,
                      mr: entry.fromOwner ? 0 : 'auto',
                      maxWidth: '80%',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      borderTopLeftRadius: entry.fromOwner ? undefined : 2,
                      borderTopRightRadius: entry.fromOwner ? 2 : undefined,
                      textAlign: entry.fromOwner ? 'right' : 'left',
                      color: entry.fromOwner
                        ? 'primary.contrastText'
                        : undefined,
                      backgroundColor: entry.fromOwner
                        ? 'primary.main'
                        : undefined,
                    }}
                  >
                    <Box sx={{ p: 2 }}>{entry.message}</Box>
                  </Box>
                </Box>
              )
            })
          })}
        </Box>
      </CondensedContainer>
    </Modal>
  ) : null
}
