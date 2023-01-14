import { Dispatch, FC, SetStateAction } from 'react'
import {
  SpaceItemType,
  SpaceItemTypeWithUser,
} from '../../components/products/types'
import { Box, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { addSpaceFormSchema } from '../../lib/schema/add-space-form-schema'
import { twFormGroup } from '../../lib/constants/css-classes'
import { useSnackbar } from '../../hooks/use-snackbar'

interface Props {
  setOpen: (isOpen: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setMySpaces: Dispatch<SetStateAction<SpaceItemTypeWithUser[]>>
  mySpaces?: SpaceItemTypeWithUser[]
  isLoading?: boolean
}

const SpaceForm: FC<Props> = ({
  setOpen,
  isLoading,
  setIsLoading,
  setMySpaces,
  mySpaces,
}) => {
  const t = useTranslation()
  const setAlert = useSnackbar((state) => state.setAlert)
  const handleAddSpace = async (values: SpaceItemType) => {
    setIsLoading(true)
    try {
      const fetchedAddSpace = await sendFormData<{
        message: string
        space: SpaceItemTypeWithUser
        spaceId: string
      }>('/api/add-space', values)

      if (fetchedAddSpace.ok) {
        const space = fetchedAddSpace.space
        mySpaces?.push({ ...space, id: fetchedAddSpace.spaceId })
        setIsLoading(false)
        setAlert({ severity: 'success', children: fetchedAddSpace.message })
        setOpen(false)
        if (Array.isArray(mySpaces)) {
          setMySpaces([...mySpaces])
        }
      } else {
        setAlert({
          severity: 'error',
          children: t(fetchedAddSpace.errorMessage),
        })
        setIsLoading(false)
        setIsLoading(false)
        setOpen(true)
      }
    } catch {
      setIsLoading(false)
      setOpen(true)
      setAlert({
        severity: 'error',
        children: t('SPACES_failed'),
      })
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
    </>
  )
}

export default SpaceForm
