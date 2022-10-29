import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react'
import {
  Box,
  Button,
  Fab,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from '../../../hooks/use-translation'
import { GetServerSideProps } from 'next'
import { ProductItem } from '../../../components/products/product-item'
import { Header } from '../../../components/header'
import { useRouter } from 'next/router'
import { ProductDetail } from '../../../components/products/product-detail'
import { ProductType } from '../../../components/products/types'
import { useAsync } from 'react-use'
import { fetchProduct } from '../../../lib/services/fetch-product'
import { fetchJson } from '../../../lib/helpers/fetch-json'
import { fetchProductList } from '../../../lib/services/fetch-product-list'
import AddIcon from '@mui/icons-material/Add'
import { CondensedContainer } from '../../../components/condensed-container'
import { borrowFormSchema } from '../../../lib/schema/borrow-form-schema'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { Formik } from 'formik'
import { CreateNewProduct } from '../../../components/products/create-product'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { products: productsQuery } = query
  let productDetail: ProductType | undefined = undefined
  const productsData = await fetchProductList()

  if (productsQuery) {
    productDetail = await fetchProduct(productsQuery[0])

    if (!productDetail) {
      return { notFound: true }
    }
  }

  return {
    props: {
      products: productsData,
      productDetail: productDetail || null,
    },
  }
}

export const Product: FC<{
  products: ProductType[]
  productDetail: ProductType
}> = ({ products, productDetail }) => {
  const t = useTranslation()
  const { query } = useRouter()
  const { products: productQuery } = query
  const isInitial = useRef(true)
  const currentQuery = useRef(productQuery?.[0])
  const [product, setProduct] = useState(productDetail)
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  useAsync(async () => {
    if (
      !!productQuery?.[0] &&
      !isInitial.current &&
      currentQuery.current !== productQuery[0]
    ) {
      const fetchedProduct = await fetchJson<ProductType>(
        `/api/product?productId=${productQuery[0]}`
      )
      setProduct(fetchedProduct)
    }
    isInitial.current = false
    currentQuery.current = productQuery?.[0]
  }, [productQuery])

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
      <CreateNewProduct
        showModal={showCreateProduct}
        onClose={setShowCreateProduct}
      />
    </>
  )
}

export default Product
