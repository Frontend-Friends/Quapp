import { FC } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useTranslation } from '../../hooks/use-translation'
import { GetServerSideProps } from 'next'
import { PRODUCTS_MOCK } from '../../mock/products-mock'

export type Product = {
  id: string
  title: string
  description?: string
  imgSrc?: string
  isAvailable: boolean
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      products: PRODUCTS_MOCK as Product[],
    },
  }
}

export const Products: FC<{ products: Product[] }> = ({ products }) => {
  const t = useTranslation()
  return (
    <>
      <div className="bg-black">Text</div>
      <Typography variant="h1">{t('PRODUCTS_title')}</Typography>
      <Grid container columns={{ md: 3 }} spacing={{ md: 4 }} pt={4}>
        {!products.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!products.length &&
          products.map((product) => (
            <Grid item xs={1} key={product.id}>
              <Card
                elevation={product.isAvailable ? undefined : 0}
                className="bg-gray-50"
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
                  <CardMedia
                    component="img"
                    height={194}
                    src={product.imgSrc}
                  />
                )}
                <CardContent>
                  {product.description && (
                    <Typography variant="body2">
                      {product.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button>{t('BUTTON_info')}</Button>
                  {product.isAvailable && (
                    <Button variant="contained">{t('BUTTON_contact')}</Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default Products
