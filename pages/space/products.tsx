import { FC } from 'react'
import {
  Box,
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
import { red } from '@mui/material/colors'
import { ProductItem } from '../../components/products/product-item'
import { Header } from '../../components/header/header'

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
      <Header
        title={t('PRODUCTS_title')}
        imgSrc="https://source.unsplash.com/random"
      />
      <Grid container columns={{ md: 3 }} spacing={{ md: 4 }} pt={4}>
        {!products.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!products.length &&
          products.map((product) => (
            <Grid item xs={1} key={product.id}>
              <ProductItem product={product} />
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default Products
