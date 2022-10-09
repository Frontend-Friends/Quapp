import { FC, useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import { useTranslation } from '../../../hooks/use-translation'
import { GetServerSideProps } from 'next'
import { PRODUCTS_MOCK } from '../../../mock/products-mock'
import { ProductItem } from '../../../components/products/product-item'
import { Header } from '../../../components/header'
import { useRouter } from 'next/router'
import { ProductDetail } from '../../../components/products/product-detail'
import { ProductType } from '../../../components/products/types'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      products: PRODUCTS_MOCK as ProductType[],
    },
  }
}

export const Product: FC<{ products: ProductType[] }> = ({ products }) => {
  const t = useTranslation()

  const { query } = useRouter()

  const product = useMemo(() => {
    return products.find((item) => item.id === query.products?.[0])
  }, [products, query])

  return (
    <>
      <Header title={t('PRODUCTS_title')} />
      <Grid container columns={{ sm: 2, md: 3 }} spacing={{ xs: 4 }} pt={4}>
        {!products.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!products.length &&
          products.map((item, index) => (
            <Grid item xs={1} key={index} sx={{ flexGrow: '1' }}>
              <ProductItem product={item} />
            </Grid>
          ))}
      </Grid>
      <ProductDetail product={product} />
    </>
  )
}

export default Product
