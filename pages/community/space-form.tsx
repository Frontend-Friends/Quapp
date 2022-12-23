import React from 'react'
import { AddSpaceType } from '../../components/products/types'
import { signupFormSchema } from '../../lib/schema/signup-form-schema'
import { Box, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { twFormGroup } from '../../constants/constants-css-classes'

interface Props {
  setOpen: (isOpen: boolean) => void
  open: boolean
  isLoading?: boolean
  handleAddSpace: (values: AddSpaceType) => Promise<void>
}

const SpaceForm: React.FC<Props> = ({
  setOpen,
  open,
  isLoading,
  handleAddSpace,
}) => {
  const t = useTranslation()
  console.log(setOpen, open)
  return (
    <Formik
      initialValues={
        {
          name: '',
          id: '',
          ownerId: '',
          creatorId: '',
          creationDate: '',
          memberCount: 0,
          itemCount: 0,
          categories: [],
        } as AddSpaceType
      }
      validationSchema={signupFormSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleAddSpace}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Box className="flex flex-col">
            <TextField
              className={twFormGroup}
              name="name"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.name}
              error={!!props.errors.name}
              helperText={props.errors.name}
              type="text"
              label={t('SPACE_name')}
              variant="outlined"
            />
          </Box>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('SPACE_add_space')}
          </LoadingButton>
        </form>
      )}
    </Formik>
  )
}

export default SpaceForm
