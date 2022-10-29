import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { useRouter } from 'next/router'
import { Box, Button, Modal, TextField } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { Formik } from 'formik'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { CreateProduct } from './types'

export const CreateNewProduct = ({
  showModal,
  onClose,
}: {
  showModal: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}) => {
  const t = useTranslation()
  const { locale } = useRouter()
  return (
    <Modal
      open={showModal}
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
          onSubmit={async (values, actions) => {
            const data = new FormData()

            Object.entries(values).forEach(([key, value]) => {
              if (value) data.append(key, value)
            })
            const result = await fetchJson('/api/create-product', {
              method: 'POST',
              body: data,
            })
            console.log(result)
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
                  defaultValue={props.values.img}
                  name="img"
                  type="file"
                  error={!!props.errors.img}
                  helperText={props.errors.img as string}
                />
                <TextField
                  label={t('CREATE_PRODUCT_title')}
                  onKeyUp={props.handleChange}
                  onBlur={props.handleBlur}
                  defaultValue={props.values.title}
                  name="title"
                  error={!!props.errors.title}
                  helperText={props.errors.title}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label={t('CREATE_PRODUCT_description')}
                  onKeyUp={props.handleChange}
                  onBlur={props.handleBlur}
                  defaultValue={props.values.description}
                  name="description"
                  error={!!props.errors.description}
                  helperText={props.errors.description}
                  sx={{ mt: 2 }}
                />
                <TextField
                  multiline
                  label={t('CREATE_PRODUCT_lead')}
                  onKeyUp={props.handleChange}
                  onBlur={props.handleBlur}
                  defaultValue={props.values.lead}
                  name="lead"
                  error={!!props.errors.lead}
                  helperText={props.errors.lead}
                  sx={{ mt: 2 }}
                />
                <TextField
                  multiline
                  label={t('CREATE_PRODUCT_text')}
                  onKeyUp={props.handleChange}
                  onBlur={props.handleBlur}
                  defaultValue={props.values.text}
                  name="text"
                  error={!!props.errors.text}
                  helperText={props.errors.text}
                  sx={{ mt: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ ml: 'auto', mt: 2 }}
                >
                  {t('CREATE_PRODUCT_submit')}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </CondensedContainer>
    </Modal>
  )
}
