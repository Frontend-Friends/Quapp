import { Dispatch, FC, SetStateAction, useState } from 'react'
import { SpaceItemType } from '../../components/products/types'
import { Box, Snackbar, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { addSpaceFormSchema } from '../../lib/schema/add-space-form-schema'
import { twFormGroup } from '../../lib/constants/css-classes'

interface Props {
  setOpen: (isOpen: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setMessage: (message: string) => void
  message: string
  setMySpaces: Dispatch<SetStateAction<SpaceItemType[]>>
  mySpaces?: SpaceItemType[]
  isLoading?: boolean
}

const SpaceForm: FC<Props> = ({
  setOpen,
  isLoading,
  setIsLoading,
  setMessage,
  message,
  setMySpaces,
  mySpaces,
}) => {
  const t = useTranslation()
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const handleAddSpace = async (values: SpaceItemType) => {
    setIsLoading(true)
    try {
      const fetchedAddSpace = await sendFormData<{
        message: string
        space: SpaceItemType
        spaceId: string
      }>('/api/add-space', values)

      if (fetchedAddSpace.ok) {
        const space = fetchedAddSpace.space
        mySpaces?.push({ ...space, id: fetchedAddSpace.spaceId })
        setIsLoading(false)
        setMessage(fetchedAddSpace.message)
        setIsSnackbarOpen(true)
        setOpen(false)
        if (Array.isArray(mySpaces)) {
          setMySpaces([...mySpaces])
        }
      } else {
        setMessage(t(fetchedAddSpace.errorMessage))
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
                label={t('SPACES_name')}
                variant="outlined"
              />
            </Box>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              {t('SPACES_add_space')}
            </LoadingButton>
          </form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
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
