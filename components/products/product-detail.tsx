import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material'
import { Header } from '../header'
import { BorrowForm, OnBorrowSubmit } from '../borrow-form'
import { ProductType } from './types'
import { ProductChats } from './product-chats'
import { User } from '../user/types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { Message } from '../message/type'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { ProductMessage } from './product-message'
import Image from 'next/image'
import Overlay from '../overlay'

type HandleSubmit = (
  ...args: [...Parameters<OnBorrowSubmit>, ProductType, string]
) => void

const handleSubmit: HandleSubmit = async (
  values,
  setSubmitting,
  product,
  space
) => {
  const fetchedData = await sendFormData('/api/borrow', {
    ...values,
    productId: product.id,
    productOwner: product.owner.id,
    space,
  })

  if (!fetchedData.ok) {
    return
  }
  setSubmitting(false)
}

export const ProductDetail = ({
  product,
  userId,
  userName,
}: {
  userId?: User['id']
  product?: ProductType | null
  userName?: string
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

  useEffect(() => {
    setProductMessage(product ? [...product.messages] : undefined)
  }, [product])

  const [borrowRequestSubmitted, setBorrowRequestSubmitted] = useState(false)

  const handleRequest = useCallback(
    async (accept: boolean, message: Message) => {
      const fetchedData = await fetchJson(`/api/borrow-response`, {
        method: 'POST',
        body: JSON.stringify({
          messageId: message.date,
          productId: message.productId,
          accept,
          requesterId: message.requesterId,
          space: message.space,
          date: message.borrowDate,
        }),
      })
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
    <Overlay
      open={modalIsOpen}
      onClose={() => {
        setBorrowRequestSubmitted(false)
        push(backUrl, undefined, { shallow: true })
      }}
      backUrl={backUrl}
    >
      {product ? (
        <>
          <Header title={product.title} titleSpacingClasses="mt-1 mb-1 pr-10" />
          <Box className="mb-3 flex items-center gap-2 py-1">
            <Avatar alt={product.owner.userName} src="" className="h-8 w-8">
              {product.owner.userName?.slice(0, 2)}
            </Avatar>
            <p className="m-0">{product.owner.userName}</p>
          </Box>
          {product.imgSrc && (
            <Box className="relative -mx-2 mb-5 pt-[50%] md:-mx-8">
              <Image
                src={product.imgSrc}
                layout="fill"
                objectFit="cover"
                alt={t('PRODUCT_image')}
              />
            </Box>
          )}
          <Typography variant="h2" className="mb-2">
            {t('PRODUCT_description')}
          </Typography>
          <Typography variant="body1">{product.description}</Typography>
          <Divider className="my-6 -mx-2 md:-mx-8" />
          {!!productMessage?.length && (
            <table cellPadding="0" cellSpacing="0" className="mb-4 w-full">
              <thead>
                <tr>
                  <th className="text-left font-medium">
                    {t('PRODUCT_request_from')}
                  </th>
                  <th className="text-left font-medium">{t('GLOBAL_date')}</th>
                  <th className="text-right font-medium">
                    {t('GLOBAL_status')}
                  </th>
                </tr>
              </thead>
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
              <Typography variant="h2" className="mb-2">
                {t('BUTTON_borrow')}
              </Typography>
              {borrowRequestSubmitted && (
                <div className="grid gap-4">
                  <p className="m-0">{t('BORROW_success_title')}</p>
                  <p className="m-0">{t('BORROW_success_text')}</p>
                  <Button
                    variant={'outlined'}
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
              <Divider className="my-6 -mx-2 md:-mx-8" />
            </Box>
          )}
          {userId && (
            <ProductChats
              userName={userName || ''}
              isOwner={product.owner.id === userId}
              chats={product.chats}
              userId={userId}
              productOwnerName={product.owner.userName}
            />
          )}
        </>
      ) : (
        <CircularProgress className="absolute top-[46%] left-[46%] block" />
      )}
    </Overlay>
  )
}
