import React from 'react'
import { SpaceItemType } from '../../components/products/types'
import { Box, Snackbar, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { twFormGroup } from '../../constants/constants-css-classes'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { addSpaceFormSchema } from '../../lib/schema/add-space-form-schema'

interface Props {
  setOpen: (isOpen: boolean) => void
  open: boolean
  isLoading?: boolean
  setIsLoading: (isLoading: boolean) => void
  setMessage: (message: string) => void
  message: string
}

const SpaceForm: React.FC<Props> = ({
  setOpen,
  open,
  isLoading,
  setIsLoading,
  setMessage,
  message,
}) => {
  const t = useTranslation()
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false)
  console.log(open)
  const handleAddSpace = async (values: SpaceItemType) => {
    setIsLoading(true)
    try {
      const fetchedAddSpace = await sendFormData<{
        isOk: boolean
        message: string
      }>('/api/add-space', values)

      if (fetchedAddSpace.isOk) {
        setIsLoading(false)
        setMessage(fetchedAddSpace.message)
        setIsSnackbarOpen(true)
        setOpen(false)
      } else {
        setOpen(true)
        setMessage(fetchedAddSpace.message)
        setIsLoading(false)
        setIsLoading(false)
        setIsSnackbarOpen(true)
        setOpen(true)
      }
    } catch {
      setIsSnackbarOpen(true)
      setIsLoading(false)
      setOpen(true)
      setMessage('SPACES_failed')
    }
  }

  return (
    <>
      <Formik
        initialValues={
          {
            name: '',
          } as SpaceItemType
        }
        validationSchema={addSpaceFormSchema}
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

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              {t('SPACE_add_space')}
            </LoadingButton>
          </form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        message={t(message)}
      />
    </>
  )
}

export default SpaceForm
