import { FC, useEffect, useMemo, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { useTranslation } from '../../../hooks/use-translation'
import { GetServerSideProps } from 'next'
import { PRODUCTS_MOCK } from '../../../mock/products-mock'
import { ProductItem } from '../../../components/products/product-item'
import { Header } from '../../../components/header'
import { useRouter } from 'next/router'
import { ProductDetail } from '../../../components/products/product-detail'

export type ProductType = {
  id: string
  title: string
  lead?: string
  text: string
  description?: string
  imgSrc?: string
  isAvailable: boolean
}

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

  const [modalState, setModalState] = useState(false)

  const product = useMemo(() => {
    return products.find((item) => item.id === query.products?.[0])
  }, [products, query])

  useEffect(() => {
    setModalState(!!query.products)
  }, [query])

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
      <ProductDetail
        product={product}
        isOpen={modalState}
        toggleModal={() => {
          setModalState(false)
        }}
      />
    </>
  )
}

export default Product
