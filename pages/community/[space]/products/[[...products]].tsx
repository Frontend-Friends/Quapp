import { useState } from 'react'
import { Alert, Fab, Grid, Snackbar, Typography } from '@mui/material'
import { useTranslation } from '../../../../hooks/use-translation'
import { InferGetServerSidePropsType } from 'next'
import { ProductItem } from '../../../../components/products/product-item'
import { Header } from '../../../../components/header'
import { ProductDetail } from '../../../../components/products/product-detail'
import { ProductType } from '../../../../components/products/types'
import { fetchProduct } from '../../../../lib/services/fetch-product'
import { fetchProductList } from '../../../../lib/services/fetch-product-list'
import AddIcon from '@mui/icons-material/Add'
import { CreateNewProduct } from '../../../../components/products/create-product'
import { useFetchProductDetail } from '../../../../hooks/use-fetch-product-detail'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../../config/session-config'

export const getServerSideProps = withIronSessionSsr<{
  userId?: string | null
  products?: ProductType[]
  productDetail?: ProductType | null
}>(async ({ query, req }) => {
  const { user } = req.session

  if (!user) {
    return { props: {} }
  }

  const { products: productsQuery, space } = query
  let productDetail: ProductType | undefined = undefined
  const productsData = await fetchProductList((space as string) || '')

  if (productsQuery) {
    productDetail = await fetchProduct(
      (space as string) || '',
      productsQuery[0]
    )

    if (!productDetail) {
      return { notFound: true }
    }
  }

  return {
    props: {
      userId: user.id || null,
      products: productsData,
      productDetail: productDetail || null,
    },
  }
}, sessionOptions)

export const Product = ({
  userId,
  products,
  productDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslation()

  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [hasError, setHasError] = useState(false)

  const product = useFetchProductDetail(productDetail)

  return (
    <>
      <Fab
        size="medium"
        color="secondary"
        aria-label={t('PRODUCT_add')}
        title={t('PRODUCT_add')}
        sx={{ position: 'fixed', top: 72, right: 12, zIndex: 10 }}
        onClick={() => {
          setShowCreateProduct(true)
        }}
      >
        <AddIcon />
      </Fab>
      <Header title={t('PRODUCTS_title')} />
      <Grid container columns={{ sm: 2, md: 3 }} spacing={{ xs: 4 }} pt={4}>
        {!products?.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!products?.length &&
          products.map((item, index) => (
            <Grid item xs={1} key={index} sx={{ flexGrow: '1' }}>
              <ProductItem product={item} userId={userId} />
            </Grid>
          ))}
      </Grid>
      <ProductDetail product={product} userId={userId} />
      <CreateNewProduct
        showModal={showCreateProduct}
        onClose={setShowCreateProduct}
        onError={() => {
          setHasError(true)
        }}
      />
      <Snackbar
        open={hasError}
        autoHideDuration={6000}
        onClose={() => {
          setHasError(false)
        }}
      >
        <Alert severity="error">${t('FORM_submitting_error')}</Alert>
      </Snackbar>
    </>
  )
}

export default Product
