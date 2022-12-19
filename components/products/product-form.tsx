import { CreateProduct, ProductType } from './types'
import { createProductSchema } from '../../lib/schema/create-product-schema'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material'
import Image from 'next/image'
import { FileUpload } from '../file-upload'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from '../../hooks/use-translation'
import AddIcon from '@mui/icons-material/Add'

export const ProductForm = ({
  categories,
  product,
  isLoading,
  onSubmit,
}: {
  categories?: string[]
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
          category: product?.category || '',
          newCategory: '',
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
          <Box className="relative grid pt-10 pb-4">
            {product?.imgSrc && (
              <Box className="relative mb-8 w-full overflow-hidden pt-[56%]">
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
              label={t('CREATE_PRODUCT_text')}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.text}
              name="text"
              error={!!props.errors.text}
              helperText={props.errors.text}
              className="mt-4"
            />
            <FormControl fullWidth className="mt-4">
              <InputLabel id="category-select">
                {t('CREATE_PRODUCT_category_label')}
              </InputLabel>
              <Select
                labelId="category-select"
                value={props.values.category}
                name="category"
                inputProps={{ className: 'flex items-center' }}
                onChange={(event) => {
                  props.setFieldValue(
                    'category',
                    event.target.value as unknown as number
                  )
                }}
                error={!!props.errors.category}
              >
                {categories?.map((category, key) => (
                  <MenuItem value={key} key={key}>
                    {category}
                  </MenuItem>
                ))}
                <MenuItem value="newCategory">
                  <AddIcon /> {t('CREATE_PRODUCT_add_category')}
                </MenuItem>
              </Select>
              <FormHelperText error={!!props.errors.category}>
                {props.errors.category}
              </FormHelperText>
            </FormControl>
            {props.values.category === 'newCategory' && (
              <TextField
                label={t('CREATE_PRODUCT_new_category')}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.newCategory}
                name="newCategory"
                className="mt-4"
                error={!!props.errors.newCategory}
                helperText={props.errors.newCategory}
              />
            )}
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
              className="ml-auto mt-4"
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
