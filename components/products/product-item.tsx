import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'
import React, { FC, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { ProductType } from './types'
import { useRouter } from 'next/router'
import { ProductMenu } from './product-menu'
import { User } from '../user/types'
import clsx from 'clsx'
import ImageNotSupportedRoundedIcon from '@mui/icons-material/ImageNotSupportedRounded'
import Overlay from '../overlay'

export const ProductItem: FC<{
  product: ProductType
  categories?: string[]
  userId?: User['id']
  onEdit: (id: string, spaceId: string) => void
  onDelete: (id: string, spaceId: string) => void
  withSpaceName?: boolean
  onClick: () => void
}> = ({
  categories,
  product,
  userId,
  onEdit,
  onDelete,
  withSpaceName,
  onClick,
}) => {
  const t = useTranslation()
  const { query } = useRouter()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  return (
    <>
      <Box className="relative h-full">
        <Link
          href={{
            href: product.id,
            query: { ...query, products: [product.id] },
          }}
          passHref
          shallow
        >
          <Card
            component={Button}
            title={`${t('PRODUCT_label')} ${product.title}`}
            color="inherit"
            variant="outlined"
            className={clsx(
              !product.isAvailable && 'bg-white',
              'flex h-full items-stretch justify-start p-0 normal-case'
            )}
            onClick={onClick}
          >
            {product.imgSrc && (
              <CardMedia
                component="img"
                className="aspect-square h-full w-1/3 max-w-[165px] object-cover"
                src={product.imgSrc}
              />
            )}
            {!product.imgSrc && (
              <Box className="grid aspect-square h-full w-1/3 max-w-[165px] items-center justify-center bg-slate-300 object-cover">
                <ImageNotSupportedRoundedIcon className="text-5xl text-slate-400 md:text-6xl" />
              </Box>
            )}
            <CardContent component="span" className="pr-6">
              {product.title && (
                <Typography
                  variant="h3"
                  className="leading-5 line-clamp-2 hyphens-auto md:text-lg"
                >
                  {product.title}
                </Typography>
              )}
              {product.text && (
                <Typography
                  variant="body2"
                  className="pt-1 text-gray-500 line-clamp-2"
                >
                  {product.text}
                </Typography>
              )}
              {withSpaceName && (
                <Typography
                  variant="body2"
                  className="pt-1 text-gray-500 line-clamp-2"
                >
                  ({t('PRODUCT_location_at')} {product.spaceName})
                </Typography>
              )}
              {categories && product.category !== undefined && (
                <Typography
                  variant="body2"
                  className="mt-2 inline-flex h-6 items-center rounded-2xl bg-blueishGray-300 px-3 py-1 text-white"
                >
                  {categories?.[product.category as number]}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Link>
        {userId === product.owner.id && (
          <Box className="absolute right-0 top-0">
            <ProductMenu
              productId={product.id}
              spaceId={product.spaceId}
              onEdit={onEdit}
              onDelete={() => {
                setOpenDeleteModal(true)
              }}
            />
          </Box>
        )}
      </Box>
      <Overlay
        open={openDeleteModal}
        onCloseClick={() => {
          setOpenDeleteModal(false)
        }}
        onClose={() => {
          setOpenDeleteModal(false)
        }}
      >
        <h3 className="m-0 mb-6 pr-12" id="delete-title">{`${t(
          'DELETE_title'
        )} ${product.title}`}</h3>
        <p id="delete-description">{t('DELETE_text')}</p>
        <Box className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              setOpenDeleteModal(false)
            }}
            variant="outlined"
          >
            {t('DELETE_cancel_button')}
          </Button>
          <Button
            onClick={() => {
              setOpenDeleteModal(false)
              onDelete(product.id, product.spaceId)
            }}
            variant="contained"
          >
            {t('DELETE_confirm_button')}
          </Button>
        </Box>
      </Overlay>
    </>
  )
}
