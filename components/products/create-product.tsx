import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { ProductType } from './types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { useRouter } from 'next/router'
import { ProductForm } from './product-form'
import { Header } from '../header'
import Overlay from '../overlay'

export const CreateEditProduct = ({
  showModal,
  onClose,
  onError,
  product,
  categories,
  onUpdateProduct,
  setCategories,
}: {
  showModal: boolean
  onClose: (state: boolean) => void
  onError?: (error: string) => void
  product: ProductType | null
  categories?: string[]
  onUpdateProduct: (product: ProductType) => void
  setCategories: Dispatch<SetStateAction<string[] | undefined>>
}) => {
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const { query } = useRouter()

  return (
    <Overlay
      open={showModal}
      onClose={() => {
        onClose(false)
      }}
      onCloseClick={() => {
        onClose(false)
      }}
    >
      <Header
        title={
          product
            ? t('EDIT_PRODUCT_page_title')
            : t('CREATE_PRODUCT_page_title')
        }
        titleSpacingClasses="mt-1 mb-1 pr-10"
      />
      <ProductForm
        categories={categories}
        product={product}
        isLoading={loading}
        onSubmit={async (values) => {
          setLoading(true)
          const createAPi = `/api/create-product?space=${query.space}`
          const updateAPi = `/api/update-product?space=${query.space}&id=${
            product?.id || ''
          }`
          const response = await sendFormData<{
            productId: string
            product: ProductType
            categories: string[]
          }>(product ? updateAPi : createAPi, values)
          if (!response.ok) {
            if (onError) onError(t('FORM_submitting_error'))
          }
          setLoading(false)
          if (response.categories?.length) {
            setCategories(response.categories)
          }

          if (response.ok) {
            onUpdateProduct({ ...product, ...response.product })
            onClose(false)
          }
        }}
      />
    </Overlay>
  )
}
