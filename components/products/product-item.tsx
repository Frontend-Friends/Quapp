import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Typography,
} from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { ProductType } from './types'
import { useRouter } from 'next/router'
import { ProductMenu } from './product-menu'
import { CondensedContainer } from '../condensed-container'
import { User } from '../user/types'
import clsx from 'clsx'
import ImageNotSupportedRoundedIcon from '@mui/icons-material/ImageNotSupportedRounded'

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
            <CardContent component="span">
              {product.title && (
                <Typography variant="h3" className="line-clamp-2 md:text-lg">
                  {product.title}
                </Typography>
              )}
              {product.description && (
                <Typography
                  variant="body2"
                  className="pt-1 text-gray-500 line-clamp-2"
                >
                  {product.description}
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
                  className="mt-2 inline-flex h-6 items-center rounded-2xl bg-blueishGray-600 px-3 py-1 text-white"
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
      <Modal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false)
        }}
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <CondensedContainer className="absolute top-1/2 left-1/2 m-0 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 drop-shadow-2xl">
          <h3 id="delete-title">{`${t('DELETE_title')} ${product.title}`}</h3>
          <p id="delete-description">{t('DELETE_text')}</p>
          <Box className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setOpenDeleteModal(false)
              }}
              variant="text"
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
        </CondensedContainer>
      </Modal>
    </>
  )
}
