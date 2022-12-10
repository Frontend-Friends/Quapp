import React, { useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import {
  Box,
  FormControlLabel,
  FormGroup,
  Modal,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { Formik } from 'formik'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { CreateProduct, ProductType } from './types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { LoadingButton } from '@mui/lab'

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
  const { query } = useRouter()
  const [loading, setLoading] = useState(false)
  const [onSuccess, setOnSuccess] = useState(false)
  const { push } = useRouter()
  return (
    <Modal
      open={showModal && !onSuccess}
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
          maxHeight: '100%',
          overflow: 'auto',
          borderRadius: { sm: 2 },
        }}
      >
        <Typography variant="h2">{t('CREATE_PRODUCT_page_title')}</Typography>
        <Formik
          initialValues={
            {
              title: product?.title || '',
              description: product?.description || '',
              lead: product?.lead || '',
              text: product?.text || '',
              img: undefined,
              isAvailable: product ? product.isAvailable : true,
            } as CreateProduct
          }
          validationSchema={createProductSchema}
          validateOnChange={false}
          validateOnBlur={false}
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

            if (response.isOk && !product) {
              setOnSuccess(true)
              await push(`/${query.space}/products/${response.productId}`)
            }
            if (response.isOk) {
              onUpdateProduct({ ...product, ...response.product })
              onClose(false)
            }
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ pt: 5, pb: 2, display: 'grid' }}>
                {product?.imgSrc && (
                  <Box
                    sx={{
                      width: '100%',
                      pt: '56%',
                      overflow: 'hidden',
                      position: 'relative',
                      mb: 4,
                    }}
                  >
                    <Image
                      src={product.imgSrc}
                      alt={t('PRODUCT_image')}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                )}
                <TextField
                  label={t('CREATE_PRODUCT_upload')}
                  onChange={(event) => {
                    props.setFieldValue(
                      'img',
                      (event.currentTarget as HTMLInputElement).files?.[0]
                    )
                  }}
                  value={props.values.img?.filepath}
                  name="img"
                  type="file"
                  error={!!props.errors.img}
                  helperText={props.errors.img as string}
                />
                <TextField
                  label={t('CREATE_PRODUCT_title')}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.title}
                  name="title"
                  error={!!props.errors.title}
                  helperText={props.errors.title}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label={t('CREATE_PRODUCT_description')}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.description}
                  name="description"
                  error={!!props.errors.description}
                  helperText={props.errors.description}
                  sx={{ mt: 2 }}
                />
                <TextField
                  multiline
                  label={t('CREATE_PRODUCT_lead')}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.lead}
                  name="lead"
                  error={!!props.errors.lead}
                  helperText={props.errors.lead}
                  sx={{ mt: 2 }}
                />
                <TextField
                  multiline
                  label={t('CREATE_PRODUCT_text')}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.text}
                  name="text"
                  error={!!props.errors.text}
                  helperText={props.errors.text}
                  sx={{ mt: 2 }}
                />
                {!!product && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked={props.values.isAvailable}
                          value={props.values.isAvailable}
                          name="isAvailable"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                      }
                      label={t('CREATE_PRODUCT_is_available')}
                    />
                  </FormGroup>
                )}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{ ml: 'auto', mt: 2 }}
                  disabled={loading}
                  loading={loading}
                >
                  {!loading && !product && t('CREATE_PRODUCT_submit')}
                  {!loading && product && t('SAVE_PRODUCT_submit')}
                </LoadingButton>
              </Box>
            </form>
          )}
        </Formik>
      </CondensedContainer>
    </Modal>
  )
}
