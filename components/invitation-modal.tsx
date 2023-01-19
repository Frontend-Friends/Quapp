import React from 'react'
import { Box, IconButton, Modal, TextField } from '@mui/material'
import { CondensedContainer } from './condensed-container'
import { Formik } from 'formik'
import { invitationFormSchema } from '../lib/schema/invitation-form-schema'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from '../hooks/use-translation'
import { InvitationType } from './products/types'
import { twFormGroup } from '../lib/constants'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  handleInvitation: (values: InvitationType) => Promise<void>
}

export const InvitationModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  isLoading,
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
        <CondensedContainer className="absolute m-0 h-full max-h-full w-full overflow-auto bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/3">
          <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
            <IconButton
              title={t('BUTTON_close')}
              className="z-10 -mt-2 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <h3 id="invitation-title" className="m-0 mb-6 pr-12">{`${t(
            'INVITATION_title'
          )} `}</h3>

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
                    helperText={t(props.errors.firstName || '')}
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
                    helperText={t(props.errors.email || '')}
                    error={!!props.errors.email}
                    type="email"
                    label={t('GLOBAL_email')}
                    variant="outlined"
                  />
                </Box>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  className="mt-2"
                  loading={isLoading}
                >
                  {t('GLOBAL_invitation_send')}
                </LoadingButton>
              </form>
            )}
          </Formik>
        </CondensedContainer>
      </Modal>
    </>
  )
}
