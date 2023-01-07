import React from 'react'
import { Box, Modal, Snackbar, TextField } from '@mui/material'
import { CondensedContainer } from '../../../../components/condensed-container'
import { Formik } from 'formik'
import { invitationFormSchema } from '../../../../lib/schema/invitation-form-schema'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from '../../../../hooks/use-translation'
import { InvitationType } from '../../../../components/products/types'
import { twFormGroup } from '../../../../lib/constants/css-classes'

interface Props {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  space: string
  isLoading: boolean
  message: string
  openSnackbar: boolean
  setOpenSnackbar: (open: boolean) => void
  handleInvitation: (values: InvitationType) => Promise<void>
}

const InvitationModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  isLoading,
  message,
  openSnackbar,
  setOpenSnackbar,
  handleInvitation,
}) => {
  const t = useTranslation()
  return (
    <>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby="invitation-title"
        aria-describedby="delete-description"
      >
        <CondensedContainer className="absolute top-1/2 left-1/2 m-0 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 drop-shadow-2xl">
          <h3 id="invitation-title">{`${t('INVITATION_title')} `}</h3>

          <Formik
            initialValues={
              { email: '', firstName: '' } as {
                email: string
                firstName: string
              }
            }
            validationSchema={invitationFormSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleInvitation}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Box className="flex flex-col">
                  <TextField
                    className={twFormGroup}
                    name="firstName"
                    value={props.values.firstName}
                    onChange={props.handleChange}
                    error={!!props.errors.firstName}
                    helperText={props.errors.firstName}
                    onBlur={props.handleBlur}
                    type="text"
                    label={t('GLOBAL_first_name')}
                    variant="outlined"
                  />

                  <TextField
                    className={twFormGroup}
                    name="email"
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={props.errors.email}
                    error={!!props.errors.email}
                    type="email"
                    label={t('GLOBAL_email')}
                    variant="outlined"
                  />
                </Box>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  className="mr-4"
                  loading={isLoading}
                >
                  {t('GLOBAL_invitation_send')}
                </LoadingButton>
              </form>
            )}
          </Formik>
        </CondensedContainer>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={t(message)}
      />
    </>
  )
}

export default InvitationModal
