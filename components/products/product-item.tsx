import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { ProductType } from './types'
import { useRouter } from 'next/router'
import { ProductMenu } from './product-menu'

export const ProductItem: FC<{
  product: ProductType
  userId?: string | null
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}> = ({ product, userId, onEdit, onDelete }) => {
  const t = useTranslation()
  const { query } = useRouter()
  return product.isAvailable ? (
    <Box sx={{ position: 'relative' }}>
      <Link
        href={{
          href: product.id,
          query: { ...query, products: [product.id] },
        }}
        passHref
        shallow
      >
        <ButtonBase
          sx={{ display: 'block' }}
          title={`${t('PRODUCT_label')} ${product.title}`}
        >
          <Card
            component="span"
            variant="outlined"
            sx={{
              backgroundColor: product.isAvailable
                ? undefined
                : 'background.paper',
              display: 'flex',
              height: '100%',
            }}
          >
            {product.imgSrc && (
              <CardMedia
                component="img"
                height={100}
                sx={{
                  width: 100,
                  height: 100,
                  overflow: 'hidden',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
                src={product.imgSrc}
              />
            )}
            {!product.imgSrc && (
              <Box
                component="span"
                sx={{
                  width: 100,
                  height: 100,
                  overflow: 'hidden',
                  objectFit: 'cover',
                  bgcolor: 'secondary.light',
                  flexShrink: 0,
                }}
              />
            )}
            <CardContent component="span">
              {product.title && (
                <Typography variant="h3">{product.title}</Typography>
              )}
              {product.description && (
                <Typography variant="body2" sx={{ pt: 0.5 }}>
                  {product.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </ButtonBase>
      </Link>
      {userId === product.owner.id && (
        <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
          <ProductMenu
            productId={product.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Box>
      )}
    </Box>
  ) : null
}
