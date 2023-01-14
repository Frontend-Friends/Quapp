import React, { Dispatch, SetStateAction, useState } from 'react'
import { Box, MenuItem, Modal, Select, TextField } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import { Formik, FormikValues } from 'formik'
import { twFormGroup } from '../../lib/constants/css-classes'
import LoadingButton from '@mui/lab/LoadingButton'
import { UseTranslationType } from '../../hooks/use-translation'
import { editSpaceSchema } from '../../lib/schema/edit-space-schema'
import { SpaceItemTypeWithUser } from '../products/types'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { User } from '../user/types'

interface Props {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  space: SpaceItemTypeWithUser | null
  setSpace: Dispatch<SetStateAction<SpaceItemTypeWithUser>>
  t: UseTranslationType
  user: User
}

const EditSpaceModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  space,
  setSpace,
  t,
  user: currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleEditSpace = async (values: FormikValues) => {
    setIsLoading(true)
    //   update space regarding ownerId and name
    try {
      const fetchedEditSpace = await sendFormData('/api/edit-space', values)

      if (fetchedEditSpace.ok) {
        setIsLoading(false)
        setOpenModal(false)
        //todo change:
        setSpace({ ...values, name: values.name })
        console.log()
      }
    } catch (error) {
      console.log(error)
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
            { name: space?.name, ownerId: space?.ownerId } as {
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

                <Select
                  name="ownerId"
                  label={t('SPACES_administrator')}
                  variant="outlined"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  className={twFormGroup}
                  id="demo-simple-select"
                  value={props.values.name}
                  error={!!props.errors.ownerId}
                  defaultValue={currentUser.id}
                >
                  {users?.map((user) => {
                    return (
                      <MenuItem value={user.id} key={user.id}>
                        {user.userName}
                      </MenuItem>
                    )
                  })}
                </Select>
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
