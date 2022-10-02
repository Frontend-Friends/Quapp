import { red } from '@mui/material/colors'
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
import { Products } from '../../pages/space/products/[[...products]]'
import { useTranslation } from '../../hooks/use-translation'

export const ProductItem: FC<{
  product: Products
  handleMoreInformation?: MouseEventHandler<HTMLButtonElement>
}> = ({ product, handleMoreInformation }) => {
  const t = useTranslation()
  return (
    <Card
      elevation={product.isAvailable ? undefined : 0}
      sx={{
        backgroundColor: product.isAvailable ? undefined : red[50],
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
          <Button variant="contained" onClick={handleMoreInformation}>
            {t('BUTTON_contact')}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
