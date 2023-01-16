import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { Box, IconButton, Modal } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { ProductType } from './types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { useRouter } from 'next/router'
import CloseIcon from '@mui/icons-material/Close'
import { ProductForm } from './product-form'
import { Header } from '../header'

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
    <Modal
      open={showModal}
      onClose={() => {
        onClose(false)
      }}
      className="flex items-center justify-center md:p-10"
    >
      <CondensedContainer className="absolute m-0 h-full max-h-full w-full overflow-auto bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:-translate-x-1/2 md:-translate-y-1/3">
        <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
          <IconButton
            title={t('BUTTON_close')}
            className="z-10 -mt-2 -mr-2 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
            onClick={() => {
              onClose(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
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
            if (response.categories.length) {
              setCategories(response.categories)
            }

            if (response.ok) {
              onUpdateProduct({ ...product, ...response.product })
              onClose(false)
            }
          }}
        />
      </CondensedContainer>
    </Modal>
  )
}
