import React, { Dispatch, SetStateAction, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [onSuccess, setOnSuccess] = useState(false)
  const { push } = useRouter()
  return (
    <Modal
      open={showModal && !onSuccess}
      onClose={() => onClose(false)}
      className="flex items-center justify-center sm:p-10"
    >
      <CondensedContainer className="relative m-0 max-h-full overflow-auto bg-white p-8 sm:rounded">
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
            const response = await sendFormData<{
              isOk: boolean
              productId: string
            }>('/api/create-product', values)
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
              <Box className="grid pt-10 pb-4">
                <TextField
                  label={t('CREATE_PRODUCT_upload')}
                  onChange={props.handleChange}
                  value={props.values.img}
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
                  className="mt-4"
                />
                <TextField
                  label={t('CREATE_PRODUCT_description')}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.description}
                  name="description"
                  error={!!props.errors.description}
                  helperText={props.errors.description}
                  className="mt-4"
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
                  className="mt-4"
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
                  className="mt-4"
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="ml-auto mt-4"
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
