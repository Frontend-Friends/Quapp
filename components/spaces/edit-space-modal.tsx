import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  AlertProps,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { Formik, FormikValues } from 'formik'
import { twFormGroup } from '../../lib/constants/css-classes'
import LoadingButton from '@mui/lab/LoadingButton'
import { UseTranslationType } from '../../hooks/use-translation'
import { editSpaceSchema } from '../../lib/schema/edit-space-schema'
import { SpaceItemTypeWithUser } from '../products/types'
import { sendFormData } from '../../lib/helpers/send-form-data'

interface Props {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setAlert: (alert: AlertProps) => void
  space: SpaceItemTypeWithUser | null
  setSpace: Dispatch<SetStateAction<SpaceItemTypeWithUser>>
  t: UseTranslationType
}

const EditSpaceModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  space,
  setSpace,
  setAlert,
  t,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event: SelectChangeEvent, props: FormikValues) => {
    props.setFieldValue('ownerId', event.target.value)
  }
  const handleEditSpace = async (values: FormikValues) => {
    setIsLoading(true)
    //   update space regarding ownerId and name
    try {
      const fetchedEditSpace = await sendFormData<{
        updatedSpace: SpaceItemTypeWithUser
        message: string
        ok: boolean
      }>('/api/edit-space', {
        ...values,
        spaceId: space?.id ?? '',
      })

      if (fetchedEditSpace.ok) {
        setIsLoading(false)
        setOpenModal(false)
        setSpace({
          ...fetchedEditSpace.updatedSpace,
        })
        setAlert({
          severity: 'success',
          children: t('SPACES_edit_ok'),
        })
      }
    } catch (error) {
      setIsLoading(false)
      setOpenModal(false)
      setAlert({
        severity: 'error',
        children: t('SPACES_edit_failed'),
      })
    }
  }

  const users: { id: string; userName: string }[] | undefined = space?.users

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false)
      }}
      aria-labelledby="invitation-title"
      aria-describedby="delete-description"
    >
      <CondensedContainer className="absolute top-1/2 left-1/2 m-0 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 drop-shadow-2xl">
        <h3 id="invitation-title">{`${t('SPACES_edit_title')} `}</h3>

        <Formik
          initialValues={
            { name: space?.name, ownerId: space?.adminId } as {
              name: string
              ownerId: string
            }
          }
          validationSchema={editSpaceSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleEditSpace}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box className="flex flex-col">
                <TextField
                  className={twFormGroup}
                  name="name"
                  value={props.values.name}
                  onChange={props.handleChange}
                  error={!!props.errors.name}
                  helperText={props.errors.name}
                  onBlur={props.handleBlur}
                  type="text"
                  label={t('SPACES_name')}
                  variant="outlined"
                />
                <FormControl fullWidth>
                  <InputLabel id="ownerId">
                    {t('SPACES_administrator')}
                  </InputLabel>
                  <Select
                    name="ownerId"
                    labelId="ownerId"
                    label={t('SPACES_administrator')}
                    variant="outlined"
                    onChange={(e) => handleChange(e, props)}
                    onBlur={props.handleBlur}
                    className={twFormGroup}
                    id="simple-select"
                    value={props.values.ownerId}
                    error={!!props.errors.ownerId}
                  >
                    {users?.map((user) => {
                      return (
                        <MenuItem value={user.id} key={user.id}>
                          {user.userName}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>
              <LoadingButton
                type="submit"
                variant="contained"
                className="mr-4"
                loading={isLoading}
              >
                {t('BUTTON_save')}
              </LoadingButton>
            </form>
          )}
        </Formik>
      </CondensedContainer>
    </Modal>
  )
}

export default EditSpaceModal
