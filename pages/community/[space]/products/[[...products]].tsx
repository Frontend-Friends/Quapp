import { ReactNode, useMemo, useState } from 'react'
import {
  Alert,
  AlertColor,
  Box,
  Fab,
  Grid,
  Pagination,
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
  deleteProduct,
  fetchProduct as fetchProductOnClient,
  useFetchProductDetail,
} from '../../../../hooks/use-fetch-product-detail'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../../config/session-config'
import { useRouter } from 'next/router'
import { User } from '../../../../components/user/types'
import { fetchJson } from '../../../../lib/helpers/fetch-json'

export const pageLimit = 5

export const getServerSideProps = withIronSessionSsr<{
  userId?: User['id']
  products?: ProductType[]
  productDetail?: ProductType | null
  count?: number
}>(async ({ query, req }) => {
  const { user } = req.session

  if (!user) {
    return { props: {} }
  }

  const { products: productsQuery, space } = query
  let productDetail: ProductType | undefined = undefined
  const { products, count } = await fetchProductList((space as string) || '')

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
      products,
      count,
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
  count,
  productDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslation()
  const { query } = useRouter()

  const [alert, setAlert] = useAlert()

  const [productList, setProductList] = useState(products)
  const [pageCount, setPageCount] = useState(count || 0)

  const maxPages = useMemo(() => Math.ceil(pageCount / pageLimit), [pageCount])

  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const product = useFetchProductDetail(productDetail)

  return (
    <div className="mx-auto px-5 pt-10">
      <Fab
        size="medium"
        color="secondary"
        aria-label={t('PRODUCT_add')}
        title={t('PRODUCT_add')}
        className=" fixed top-[72px] right-[12px] z-10"
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
            <Grid item xs={1} key={index} className="w-full flex-grow">
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
            } else {
              state?.unshift(updatedProduct)
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
      <Box className="py-4">
        {count && (
          <Pagination
            count={maxPages}
            size="large"
            onChange={async (...props) => {
              const value = props[1]
              const fetchedProductList = await fetchJson<{
                products: ProductType[]
                count: number
              }>(`/api/product-list?space=${query.space}&skip=${value - 1}`)
              console.log(value - 1)
              setProductList(fetchedProductList.products)
              setPageCount(fetchedProductList.count)
            }}
          />
        )}
      </Box>
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
    </div>
  )
}

export default Product
