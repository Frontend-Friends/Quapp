import React, { useState } from 'react'
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
}: {
  showModal: boolean
  onClose: (state: boolean) => void
  onError?: (error: string) => void
  product: ProductType | null
  categories?: string[]
  onUpdateProduct: (product: ProductType) => void
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
      <CondensedContainer className="relative m-0 max-h-full min-h-screen overflow-auto bg-white shadow-2xl md:min-h-max">
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
            }>(product ? updateAPi : createAPi, values)
            if (!response.ok) {
              if (onError) onError(t('FORM_submitting_error'))
            }
            setLoading(false)

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
