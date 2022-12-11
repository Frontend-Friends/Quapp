import { ReactNode, useState } from 'react'
import {
  Alert,
  AlertColor,
  Fab,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material'
import { useTranslation } from '../../../../hooks/use-translation'
import { InferGetServerSidePropsType } from 'next'
import { ProductItem } from '../../../../components/products/product-item'
import { Header } from '../../../../components/header'
import { ProductDetail } from '../../../../components/products/product-detail'
import { ProductType } from '../../../../components/products/types'
import { fetchProduct } from '../../../../lib/services/fetch-product'
import { fetchProductList } from '../../../../lib/services/fetch-product-list'
import AddIcon from '@mui/icons-material/Add'
import { CreateEditProduct } from '../../../../components/products/create-product'
import {
  useFetchProductDetail,
  fetchProduct as fetchProductOnClient,
  deleteProduct,
} from '../../../../hooks/use-fetch-product-detail'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../../config/session-config'
import { useRouter } from 'next/router'

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

const useAlert = () => {
  return useState<{ severity: AlertColor; children: ReactNode }>()
}

export const Product = ({
  userId,
  products,
  productDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslation()
  const { query } = useRouter()

  const [alert, setAlert] = useAlert()

  const [productList, setProductList] = useState(products)

  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

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
      <Grid container columns={{ md: 2, lg: 3 }} spacing={{ xs: 4 }} pt={4}>
        {!productList?.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!productList?.length &&
          productList.map((item, index) => (
            <Grid item xs={1} key={index} sx={{ flexGrow: '1', width: '100%' }}>
              <ProductItem
                product={item}
                userId={userId}
                onDelete={async (id) => {
                  await deleteProduct(id, query.space as string)
                  setProductList((state) =>
                    state?.filter((entry) => entry.id !== id)
                  )
                  setAlert({
                    severity: 'success',
                    children: t('DELETE_PRODUCT_success_text'),
                  })
                  setOpenSnackbar(true)
                }}
                onEdit={async (id) => {
                  const fetchedProduct = await fetchProductOnClient(
                    id,
                    query.space as string
                  )
                  setProductToEdit(fetchedProduct || null)
                  setShowCreateProduct(true)
                }}
              />
            </Grid>
          ))}
      </Grid>
      <ProductDetail product={product} userId={userId} />
      <CreateEditProduct
        onUpdateProduct={(updatedProduct) => {
          setProductList((state) => {
            const foundIndex = state?.findIndex(
              (item) => item.id === updatedProduct.id
            )
            if (state && foundIndex !== undefined && foundIndex > -1) {
              state[foundIndex] = updatedProduct
            }
            return state ? [...state] : state
          })
          setAlert({
            severity: 'success',
            children: `${t('PRODUCT_updated_info')} ${updatedProduct.title}`,
          })
          setOpenSnackbar(true)
        }}
        showModal={showCreateProduct}
        onClose={(state) => {
          setProductToEdit(null)
          setShowCreateProduct(state)
        }}
        product={productToEdit}
        onError={(error) => {
          setAlert({ severity: 'error', children: error })
          setOpenSnackbar(true)
        }}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => {
          setOpenSnackbar(false)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert {...alert} />
      </Snackbar>
    </>
  )
}

export default Product
