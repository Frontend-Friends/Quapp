import { CreateProduct, ProductType } from './types'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from '@mui/material'
import Image from 'next/image'
import { FileUpload } from '../file-upload'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from '../../hooks/use-translation'

export const ProductForm = ({
  product,
  isLoading,
  onSubmit,
}: {
  product: ProductType | null
  isLoading: boolean
  onSubmit: (values: CreateProduct) => void
}) => {
  const t = useTranslation()

  return (
    <Formik
      initialValues={
        {
          title: product?.title || '',
          description: product?.description || '',
          text: product?.text || '',
          img: undefined,
          isAvailable: product ? product.isAvailable : true,
        } as CreateProduct
      }
      validationSchema={createProductSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Box className="pt-10 pb-4 grid relative">
            {product?.imgSrc && (
              <Box className="w-full pt-[56%] overflow-hidden relative mb-8">
                <Image
                  src={product.imgSrc}
                  alt={t('PRODUCT_image')}
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            )}
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
              label={t('CREATE_PRODUCT_text')}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.text}
              name="text"
              error={!!props.errors.text}
              helperText={props.errors.text}
              sx={{ mt: 2 }}
            />
            <FileUpload props={props} />
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
              disabled={isLoading}
              loading={isLoading}
            >
              {!product && t('CREATE_PRODUCT_submit')}
              {product && t('SAVE_PRODUCT_submit')}
            </LoadingButton>
          </Box>
        </form>
      )}
    </Formik>
  )
}
