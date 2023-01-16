import { Products } from './products'
import {
  deleteProduct,
  useFetchProductDetail,
} from '../../hooks/use-fetch-product-detail'
import { fetchProductApi } from '../../lib/helpers/fetch-product-api'
import { PageLoader } from '../page-loader'
import { ProductDetail } from './product-detail'
import { CreateEditProduct } from './create-product'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ProductType } from './types'
import {
  Box,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useTranslation } from '../../hooks/use-translation'
import { useSnackbar } from '../../hooks/use-snackbar'
import { deleteObjectKey } from '../../lib/helpers/delete-object-key'
import { useAsync } from 'react-use'
import { getQueryAsNumber } from '../../lib/helpers/get-query-as-number'
import { maxProductsPerPage } from '../../pages/community/[space]/products/[[...products]]'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { getProducts } from '../../lib/services/get-products'
import AddIcon from '@mui/icons-material/Add'

export const ProductList = ({
  products,
  productDetail,
  userId,
  categories,
  userName,
  count,
  withSpaceName,
  space,
}: {
  products?: ProductType[]
  productDetail?: ProductType | null
  userId?: string | null
  categories?: string[]
  userName?: string
  count?: number
  withSpaceName?: boolean
  space?: string | null
}) => {
  const t = useTranslation()

  const setAlert = useSnackbar((state) => state.setAlert)

  const { query, push, asPath } = useRouter()

  const { skip, filter } = query as {
    space: string
    skip?: string
    filter?: string
  }

  const lastPage = useRef(skip)
  const lastFilter = useRef(filter)

  const [productList, setProductList] = useState(products)
  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentSpace, setCurrentSpace] = useState(space)

  const [categoryFilter, setCategoryFilter] = useState<string | number>(
    filter ?? ''
  )
  const [productCategories, setProductCategories] = useState(categories)

  const [pageCount, setPageCount] = useState(count || 0)

  const maxPages = useMemo(
    () =>
      pageCount > maxProductsPerPage
        ? Math.ceil(pageCount / maxProductsPerPage)
        : 0,
    [pageCount]
  )

  const currentPage = useMemo(() => {
    const page = getQueryAsNumber(skip) + 1
    return page > maxPages ? maxPages : page
  }, [skip, maxPages])

  useAsync(async () => {
    if (
      (lastPage.current === skip && lastFilter.current === filter) ||
      !currentSpace
    ) {
      return
    }
    setIsLoading(true)
    lastPage.current = skip
    lastFilter.current = filter
    const fetchedProductList = await getProducts(currentSpace, skip, filter)
    if (fetchedProductList.ok) {
      setProductList(fetchedProductList.products)
      setPageCount(fetchedProductList.count)
      window.scrollTo({ top: 0 })
    } else {
      setAlert({
        severity: 'error',
        children: fetchedProductList.errorMessage,
      })
    }
    setIsLoading(false)
  }, [currentSpace, skip, filter, asPath])

  const product = useFetchProductDetail(productDetail, currentSpace)

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

  return (
    <>
      <Box className="flex items-center">
        {productCategories && (
          <FormControl className="w-full md:w-1/2 lg:max-w-[32.5%]">
            <InputLabel id="filter-select">
              {t('PRODUCTS_filter_category_label')}
            </InputLabel>
            <Select
              labelId="filter-select"
              label={t('PRODUCTS_filter_category_label')}
              value={categoryFilter}
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                {t('PRODUCTS_reset_category_filter')}
              </MenuItem>
              {productCategories.map((category, index) => (
                <MenuItem value={index} key={index}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {!withSpaceName && (
          <Fab
            color="secondary"
            variant="extended"
            className="fixed bottom-[81px] right-[15px] z-10 h-12 w-12 rounded-full p-6 text-[0px] md:static md:bottom-[unset] md:right-[unset] md:ml-auto md:h-auto md:w-auto md:py-1 md:text-base"
            aria-label={t('PRODUCT_add')}
            onClick={() => {
              setShowCreateProduct(true)
            }}
          >
            <AddIcon className="text-4xl md:mr-2 md:text-3xl" />{' '}
            {t('PRODUCT_add')}
          </Fab>
        )}
      </Box>
      <Products
        products={productList}
        onDelete={async (id, spaceId) => {
          await deleteProduct(id, spaceId)
          setProductList((state) => state?.filter((entry) => entry.id !== id))
          setAlert({
            severity: 'success',
            children: t('DELETE_PRODUCT_success_text'),
          })
        }}
        onEdit={async (id, spaceId) => {
          const fetchedProduct = await fetchProductApi(spaceId, id)
          setProductToEdit(fetchedProduct || null)
          setShowCreateProduct(true)
        }}
        userId={userId}
        categories={productCategories}
        withSpaceName={withSpaceName}
        setSpace={setCurrentSpace}
      >
        <PageLoader isLoading={isLoading} className="fixed inset-0 z-10" />
        <ProductDetail product={product} userId={userId} userName={userName} />
        <CreateEditProduct
          categories={productCategories}
          setCategories={setProductCategories}
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
          }}
          showModal={showCreateProduct}
          onClose={(state) => {
            setProductToEdit(null)
            setShowCreateProduct(state)
          }}
          product={productToEdit}
          onError={(error) => {
            setAlert({ severity: 'error', children: error })
          }}
        />
      </Products>
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
    </>
  )
}
