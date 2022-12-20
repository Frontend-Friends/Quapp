import React, { useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { Box, IconButton, Modal, Typography } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { ProductType } from './types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { useRouter } from 'next/router'
import CloseIcon from '@mui/icons-material/Close'
import { ProductForm } from './product-form'

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
      className="flex items-center justify-center sm:p-10"
    >
      <CondensedContainer className="relative m-0 max-h-full overflow-auto bg-white p-8 sm:rounded-2xl">
        <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
          <IconButton
            title={t('BUTTON_close')}
            className="-mt-6 -mr-6 h-12 w-12 border border-gray-100 bg-white"
            onClick={() => {
              onClose(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h2">
          {product
            ? t('EDIT_PRODUCT_page_title')
            : t('CREATE_PRODUCT_page_title')}
        </Typography>
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
              isOk: boolean
              productId: string
              product: ProductType
            }>(product ? updateAPi : createAPi, values)
            if (!response.isOk) {
              if (onError) onError(t('FORM_submitting_error'))
            }
            setLoading(false)

            if (response.isOk) {
              onUpdateProduct({ ...product, ...response.product })
              onClose(false)
            }
          }}
        />
      </CondensedContainer>
    </Modal>
  )
}
