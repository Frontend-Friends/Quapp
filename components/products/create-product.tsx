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
  onUpdateProduct,
}: {
  showModal: boolean
  onClose: (state: boolean) => void
  onError?: (error: string) => void
  product: ProductType | null
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
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { sm: 5 },
      }}
    >
      <CondensedContainer
        sx={{
          position: 'relative',
          backgroundColor: 'background.paper',
          p: 4,
          m: 0,
          height: { xs: '100%', sm: 'auto' },
          maxHeight: '100%',
          overflow: 'auto',
          borderRadius: { sm: 2 },
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            height: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 10,
          }}
        >
          <IconButton
            title={t('BUTTON_close')}
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              marginTop: -3,
              marginRight: -3,
              width: '48px',
              height: '48px',
            }}
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
