import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material'
import { FC, MouseEventHandler } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { ProductType } from './types'
import { ProductMenu } from './product-menu'
import { useRouter } from 'next/router'

export const ProductItem: FC<{
  product: ProductType
  handleMoreInformation?: MouseEventHandler<HTMLButtonElement>
  userId: string
}> = ({ product, handleMoreInformation, userId }) => {
  const t = useTranslation()
  const { query } = useRouter()
  return (
    <Card
      variant={product.isAvailable ? undefined : 'outlined'}
      sx={{
        backgroundColor: product.isAvailable ? undefined : 'background.paper',
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
      }}
    >
      <CardHeader
        title={product.title}
        action={
          userId === product.owner.id && <ProductMenu productId={product.id} />
        }
      />
      {product.imgSrc && (
        <CardMedia component="img" height={194} src={product.imgSrc} />
      )}
      {!product.imgSrc && (
        <Box
          sx={{ width: '100%', flexGrow: '1', bgcolor: 'secondary.light' }}
        />
      )}
      <CardContent sx={{ mt: 'auto' }}>
        {product.description && (
          <Typography variant="body2">{product.description}</Typography>
        )}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!product.isAvailable && (
          <Box p={1} color="red">
            {t('PRODUCT_not_available')}
          </Box>
        )}
        {product.isAvailable && (
          <Link
            href={`/${query.space}/products/${product.id}`}
            passHref
            shallow
          >
            <Button variant="contained" onClick={handleMoreInformation}>
              {t('BUTTON_contact')}
            </Button>
          </Link>
        )}
      </CardActions>
    </Card>
  )
}
