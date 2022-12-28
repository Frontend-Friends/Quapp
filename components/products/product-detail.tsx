import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import {
  Avatar,
  Box,
  Button,
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
import { sendFormData } from '../../lib/helpers/send-form-data'
import { Message } from '../message/type'
import dayjs from 'dayjs'
import CheckIcon from '@mui/icons-material/Check'
import { fetchJson } from '../../lib/helpers/fetch-json'

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

type HandleSubmit = (
  ...args: [...Parameters<OnBorrowSubmit>, ProductType, string]
) => void

const handleSubmit: HandleSubmit = async (
  values,
  setSubmitting,
  product,
  space
) => {
  const fetchedData = await sendFormData<{ status: number }>('/api/borrow', {
    ...values,
    productId: product.id,
    productOwner: product.owner.id,
    space,
  })

  if (fetchedData.status === 500) {
    return
  }
  setSubmitting(false)
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

  const [productMessage, setProductMessage] = useState(product?.messages)

  const [borrowRequestSubmitted, setBorrowRequestSubmitted] = useState(false)

  const handleRequest = useCallback(
    async (accept: boolean, message: Message) => {
      const fetchedData = await fetchJson<{ ok: boolean }>(
        `/api/borrow-response`,
        {
          method: 'POST',
          body: JSON.stringify({
            messageId: message.date,
            productId: message.productId,
            accept,
            userId: message.requesterId,
            space: message.space,
            date: message.borrowDate,
          }),
        }
      )
      if (fetchedData.ok) {
        setProductMessage((state) => {
          if (!state) {
            return state
          }
          const foundIndex = state.findIndex(
            (item) => item.date === message.date
          )
          state[foundIndex] = {
            ...message,
            accept,
            read: true,
            status: 'replied',
          }
          return [...state]
        })
      }
    },
    []
  )

  const t = useTranslation()
  return (
    <Modal
      open={modalIsOpen}
      onClose={() => {
        push(backUrl, undefined, { shallow: true })
      }}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="flex items-center justify-center md:p-10"
      disablePortal
    >
      {product ? (
        <CondensedContainer className="relative m-0 max-h-full min-h-screen overflow-auto bg-white p-8 md:min-h-max md:rounded-2xl">
          <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
            <Link href={backUrl} passHref shallow>
              <IconButton
                title={t('BUTTON_close')}
                className="-mt-6 -mr-6 h-12 w-12 border border-slate-200 bg-white"
              >
                <CloseIcon />
              </IconButton>
            </Link>
          </Box>
          <Header
            title={product.title}
            lead={product.description}
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
          {!!productMessage?.length && (
            <table className="w-full">
              <tbody>
                {productMessage.map((message, index) => (
                  <ProductMessage
                    message={message}
                    key={index}
                    onAccept={async () => {
                      await handleRequest(true, message)
                    }}
                    onDecline={async () => {
                      await handleRequest(false, message)
                    }}
                  />
                ))}
              </tbody>
            </table>
          )}
          {userId !== product.owner.id && (
            <Box className="relative flex flex-col">
              <Box className="absolute top-0 ml-4 rounded border border-slate-200 bg-white p-2">
                <Typography variant="body2"> {t('BUTTON_borrow')}</Typography>
              </Box>
              <Card variant="outlined" className="mt-6">
                <CardContent>
                  {borrowRequestSubmitted && (
                    <div className="grid gap-4">
                      <p className="m-0">{t('BORROW_success_title')}</p>
                      <p className="m-0">
                        {t('BORROW_success_text')}
                        stellen?
                      </p>
                      <Button
                        onClick={() => {
                          setBorrowRequestSubmitted(false)
                        }}
                      >
                        {t(`BORROW_new_request`)}
                      </Button>
                    </div>
                  )}
                  {!borrowRequestSubmitted && (
                    <BorrowForm
                      onSubmit={async (values, setIsSubmitting) => {
                        await handleSubmit(
                          values,
                          setIsSubmitting,
                          product,
                          query.space as string
                        )
                        setBorrowRequestSubmitted(true)
                      }}
                      product={product}
                    />
                  )}
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
