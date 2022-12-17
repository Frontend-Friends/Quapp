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

export const ProductItem: FC<{
  product: ProductType
  userId?: User['id']
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}> = ({ product, userId, onEdit, onDelete }) => {
  const t = useTranslation()
  const { query } = useRouter()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  return (
    <>
      <Box className="relative">
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
              'flex justify-start h-full'
            )}
          >
            {product.imgSrc && (
              <CardMedia
                component="img"
                height={100}
                className="w-full h-full overflow-hidden object-cover flex-shrink-0"
                src={product.imgSrc}
              />
            )}
            {!product.imgSrc && (
              <Box
                component="span"
                className="w-full h-full overflow-hidden object-cover bg-mintGreen-300 flex-shrink-0"
              />
            )}
            <CardContent component="span">
              {product.title && (
                <Typography variant="h3">{product.title}</Typography>
              )}
              {product.description && (
                <Typography variant="body2" className="pt-10">
                  {product.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Link>
        {userId === product.owner.id && (
          <Box className="absolute right-0 top-0">
            <ProductMenu
              productId={product.id}
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
        <CondensedContainer className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white drop-shadow-2xl m-0 p-8 rounded-2xl">
          <h3 id="delete-title">{`${t('DELETE_title')} ${product.title}`}</h3>
          <p id="delete-description">{t('DELETE_text')}</p>
          <Box className="grid gap-4 grid-cols-2">
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
                onDelete(product.id)
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
