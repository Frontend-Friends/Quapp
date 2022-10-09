import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { FC, MouseEventHandler } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { ProductType } from './types'

export const ProductItem: FC<{
  product: ProductType
  handleMoreInformation?: MouseEventHandler<HTMLButtonElement>
}> = ({ product, handleMoreInformation }) => {
  const t = useTranslation()
  return (
    <Card
      variant={product.isAvailable ? undefined : 'outlined'}
      sx={{
        backgroundColor: product.isAvailable ? undefined : 'background.paper',
      }}
    >
      <CardHeader
        title={product.title}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      />
      {product.imgSrc && (
        <CardMedia component="img" height={194} src={product.imgSrc} />
      )}
      <CardContent>
        {product.description && (
          <Typography variant="body2">{product.description}</Typography>
        )}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button>{t('BUTTON_info')}</Button>
        {!product.isAvailable && (
          <Box p={1} color="red">
            {t('PRODUCT_not_available')}
          </Box>
        )}
        {product.isAvailable && (
          <Link href={product.id} passHref shallow>
            <Button variant="contained" onClick={handleMoreInformation}>
              {t('BUTTON_contact')}
            </Button>
          </Link>
        )}
      </CardActions>
    </Card>
  )
}
