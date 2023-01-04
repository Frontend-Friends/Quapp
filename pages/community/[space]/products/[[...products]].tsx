import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import {
  Alert,
  AlertColor,
  Box,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Snackbar,
  Typography,
} from '@mui/material'
import { useTranslation } from '../../../../hooks/use-translation'
import { InferGetServerSidePropsType } from 'next'
import { ProductItem } from '../../../../components/products/product-item'
import { Header } from '../../../../components/header'
import { ProductDetail } from '../../../../components/products/product-detail'
import {
  ProductType,
  SpaceItemType,
} from '../../../../components/products/types'
import { fetchProduct } from '../../../../lib/services/fetch-product'
import { fetchProductList } from '../../../../lib/services/fetch-product-list'
import { CreateEditProduct } from '../../../../components/products/create-product'
import {
  deleteProduct,
  useFetchProductDetail,
} from '../../../../hooks/use-fetch-product-detail'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../../config/session-config'
import { useRouter } from 'next/router'
import { User } from '../../../../components/user/types'
import { fetchJson } from '../../../../lib/helpers/fetch-json'
import { getQueryAsNumber } from '../../../../lib/helpers/get-query-as-number'
import { getDoc } from 'firebase/firestore'
import { deleteObjectKey } from '../../../../lib/helpers/delete-object-key'
import { useAsync } from 'react-use'
import { ParsedUrlQuery } from 'querystring'
import { PageLoader } from '../../../../components/page-loader'
import { getSpaceRef } from '../../../../lib/helpers/refs/get-space-ref'
import AddRounded from '@mui/icons-material/AddRounded'
import { fetchProductApi } from '../../../../lib/helpers/fetch-product-api'

export const maxProductsPerPage = 20

export const getServerSideProps = withIronSessionSsr<{
  userId?: User['id']
  userName?: User['userName']
  products?: ProductType[]
  productDetail?: ProductType | null
  count?: number
  spaceName?: string
  categories?: string[]
}>(async ({ query, req }) => {
  const { user } = req.session

  if (!user) {
    return { props: {} }
  }

  const { products: productsQuery, space, skip, filter } = query

  let productDetail: ProductType | undefined = undefined
  const { products, count } = await fetchProductList(
    (space as string) || '',
    getQueryAsNumber(skip),
    filter === undefined ? undefined : getQueryAsNumber(filter)
  )

  if (productsQuery) {
    productDetail = await fetchProduct(
      (space as string) || '',
      productsQuery[0],
      user.id || ''
    )

    if (!productDetail) {
      return { notFound: true }
    }
  }

  const [spaceRef] = getSpaceRef(space as string)
  const fetchedSpace = await getDoc(spaceRef).then(
    (result) => result.data() as SpaceItemType
  )

  const spaceData = await getDoc(spaceRef).then((r) => r.data())

  return {
    props: {
      userId: user.id || null,
      userName: user.userName || '',
      products,
      count,
      productDetail: productDetail || null,
      categories: spaceData?.categories || [],
      spaceName: fetchedSpace.name,
    },
  }
}, sessionOptions)

const useAlert = () => {
  return useState<{ severity: AlertColor; children: ReactNode }>()
}

const getProducts = async (space: string, skip?: string, filter?: string) => {
  const filterNumber = parseInt(filter || '')
  const filterQuery = isNaN(filterNumber) ? '' : `&filter=${filterNumber}`
  const skipQuery = skip === undefined ? '' : `&skip=${skip}`
  return fetchJson<{
    products: ProductType[]
    count: number
  }>(`/api/product-list?space=${space}${skipQuery}${filterQuery}`)
}

export const Product = ({
  userName,
  userId,
  products,
  count,
  spaceName,
  productDetail,
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslation()
  const { query, push, asPath } = useRouter()

  const { skip, filter, space } = query as {
    space: string
    skip?: string
    filter?: string
  }

  const [categoryFilter, setCategoryFilter] = useState<string | number>(
    filter ?? ''
  )
  const lastPage = useRef(skip)
  const lastFilter = useRef(filter)

  const [alert, setAlert] = useAlert()

  const [productList, setProductList] = useState(products)
  const [pageCount, setPageCount] = useState(count || 0)
  const [isLoading, setIsLoading] = useState(false)

  const maxPages = useMemo(
    () =>
      pageCount > maxProductsPerPage
        ? Math.ceil(pageCount / maxProductsPerPage)
        : 0,
    [pageCount]
  )

  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const product = useFetchProductDetail(productDetail)

  const currentPage = useMemo(() => {
    const page = getQueryAsNumber(skip) + 1
    return page > maxPages ? maxPages : page
  }, [skip, maxPages])

  const handleFilterChange = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      const urlQuery = {
        ...query,
        filter: event.target.value,
      } as ParsedUrlQuery

      if (typeof event.target.value === 'string') {
        deleteObjectKey(urlQuery, 'filter')
      }

      deleteObjectKey(urlQuery, 'skip')

      setCategoryFilter(event.target.value)

      push({ query: urlQuery }, undefined, {
        shallow: true,
      })
    },
    [push, query]
  )

  useAsync(async () => {
    if (lastPage.current === skip && lastFilter.current === filter) {
      return
    }
    setIsLoading(true)
    lastPage.current = skip
    lastFilter.current = filter
    const fetchedProductList = await getProducts(space, skip, filter)
    if (fetchedProductList.ok) {
      setProductList(fetchedProductList.products)
      setPageCount(fetchedProductList.count)
      window.scrollTo({ top: 0 })
    } else {
      setAlert({
        severity: 'error',
        children: fetchedProductList.errorMessage,
      })
      setOpenSnackbar(true)
    }
    setIsLoading(false)
  }, [space, skip, filter, asPath])

  return (
    <main className="m mx-auto grid w-full max-w-7xl gap-4 p-3">
      <Fab
        size="large"
        color="secondary"
        aria-label={t('PRODUCT_add')}
        title={t('PRODUCT_add')}
        className="fixed bottom-[115px] right-[16px] z-10 p-8 md:bottom-[50px] md:right-[24px]"
        onClick={() => {
          setShowCreateProduct(true)
        }}
      >
        <AddRounded fontSize="large" />
      </Fab>
      {spaceName && <Header title={spaceName} />}
      {categories && (
        <FormControl className="lg:max-w-[32.5%]">
          <InputLabel id="filter-select">
            {t('PRODUCTS_filter_category_label')}
          </InputLabel>
          <Select
            labelId="filter-select"
            label={t('PRODUCTS_filter_category_label')}
            value={categoryFilter}
            onChange={handleFilterChange}
          >
            <MenuItem value="">{t('PRODUCTS_reset_category_filter')}</MenuItem>
            {categories.map((category, index) => (
              <MenuItem value={index} key={index}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <section className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {!productList?.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!productList?.length &&
          productList.map((item, index) => (
            <article key={index}>
              <ProductItem
                categories={categories}
                product={item}
                userId={userId}
                onDelete={async (id) => {
                  await deleteProduct(id, space as string)
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
                  const fetchedProduct = await fetchProductApi(
                    space as string,
                    id
                  )
                  setProductToEdit(fetchedProduct || null)
                  setShowCreateProduct(true)
                }}
              />
            </article>
          ))}
        <PageLoader isLoading={isLoading} className="fixed inset-0 z-10" />
      </section>
      <ProductDetail product={product} userId={userId} userName={userName} />
      <CreateEditProduct
        categories={categories}
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
        {!!maxPages && (
          <Pagination
            count={maxPages}
            size="large"
            page={currentPage}
            onChange={async (...props) => {
              const value = props[1]

              const urlQuery = { ...query, skip: value - 1 }

              if (value - 1 === 0) {
                deleteObjectKey(urlQuery, 'skip')
              }

              push({ query: urlQuery }, undefined, {
                shallow: true,
              })
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
    </main>
  )
}

export default Product
