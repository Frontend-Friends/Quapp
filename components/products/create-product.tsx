import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { Formik } from 'formik'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { CreateProduct } from './types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { useRouter } from 'next/router'

export const CreateNewProduct = ({
  showModal,
  onClose,
  onError,
}: {
  showModal: boolean
  onClose: Dispatch<SetStateAction<boolean>>
  onError?: () => void
}) => {
  const t = useTranslation()
  const { query } = useRouter()
  const [loading, setLoading] = useState(false)
  const [onSuccess, setOnSuccess] = useState(false)
  const { push } = useRouter()
  return (
    <Modal
      open={showModal && !onSuccess}
      onClose={() => onClose(false)}
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
              title: '',
              description: '',
              lead: '',
              text: '',
              img: undefined,
            } as CreateProduct
          }
          validationSchema={createProductSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values) => {
            setLoading(true)
            console.log(values)
            const response = await sendFormData<{
              isOk: boolean
              productId: string
            }>(`/api/create-product?space=${query.space}`, values)
            if (!response.isOk) {
              if (onError) onError()
            }
            setLoading(false)
            setOnSuccess(true)

            if (response.isOk) push(response.productId)
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ pt: 5, pb: 2, display: 'grid' }}>
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
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ ml: 'auto', mt: 2 }}
                  disabled={loading}
                >
                  {loading && t('CREATE_PRODUCT_loading')}
                  {!loading && t('CREATE_PRODUCT_submit')}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </CondensedContainer>
    </Modal>
  )
}
