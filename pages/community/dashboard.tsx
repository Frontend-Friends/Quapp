import React, { FC, useState } from 'react'
import { CondensedContainer } from '../../components/condensed-container'
import { useTranslation } from '../../hooks/use-translation'
import {
  Box,
  Button,
  Fab,
  Grid,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { Header } from '../../components/header'
import AddIcon from '@mui/icons-material/Add'
import { InferGetServerSidePropsType } from 'next'
import { InvitationType, SpaceItemType } from '../../components/products/types'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import SpaceItem from '../../components/spaces/space-item'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import SpaceForm from './space-form'
import { fetchUser } from '../../lib/services/fetch-user'
import LoadingButton from '@mui/lab/LoadingButton'
import { Formik } from 'formik'
import { twFormGroup } from '../../constants/constants-css-classes'
import { invitationFormSchema } from '../../lib/schema/invitation-form-schema'
import { sendFormData } from '../../lib/helpers/send-form-data'

export const getServerSideProps = withIronSessionSsr<{
  spaces?: SpaceItemType[]
}>(async ({ req }) => {
  const { user } = req.session
  if (!user) {
    return { props: {} }
  }
  const fetchedUser = await fetchUser(user.id ?? '')
  const spaces = await Promise.all<SpaceItemType>(
    fetchedUser.spaces?.map(
      (space) =>
        new Promise(async (resolve) => {
          const ref = doc(db, 'spaces', space)
          const fetchedDoc = await getDoc(ref).then((result) => {
            const data = result.data()
            return {
              ...data,
              id: result.id,
              creationDate: data?.creationDate?.seconds ?? 0,
            } as SpaceItemType
          })
          resolve(fetchedDoc)
        })
    ) || []
  )
  return { props: { spaces } }
}, sessionOptions)
const Dashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  spaces,
}) => {
  const t = useTranslation()
  const [open, setOpen] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [message, setMessage] = useState('')

  const handleInvitation = async (values: InvitationType) => {
    setIsLoading(true)
    try {
      const invitation = await sendFormData<{
        isInvitationOk: boolean
        message: string
      }>('/api/invitation', values)
      setMessage(invitation.message)
      setOpenSnackbar(true)
      setOpenModal(true)
      setIsLoading(false)
    } catch {
      setMessage(t('INVITATION_server_error'))
      setOpenSnackbar(true)
      setOpenModal(true)
      setIsLoading(false)
    }
  }

  return (
    <>
      <CondensedContainer className="relative">
        <Header title={t('SPACES_title')} />
        {!!spaces?.length ? (
          <>
            <Button onClick={() => setOpenModal(true)} variant="contained">
              {t('BUTTON_invite_member')}
            </Button>
            <Grid container columns={{ md: 1 }} spacing={{ xs: 4 }} pt={4}>
              {spaces.map((space) => (
                <SpaceItem key={space.id} space={space} />
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
        )}
        <Fab
          color="primary"
          aria-label="add"
          variant="extended"
          className="mt-8"
          onClick={() => setOpen((state) => !state)}
        >
          <AddIcon className="mr-2" /> {t('SPACES_add_space')}
        </Fab>
        {open && (
          <SpaceForm
            setOpen={setOpen}
            open={open}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setMessage={setMessage}
            message={message}
          />
        )}
      </CondensedContainer>
      {/*todo move to separate component*/}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby="invitation-title"
        aria-describedby="delete-description"
      >
        <CondensedContainer className="absolute top-1/2 left-1/2 m-0 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 drop-shadow-2xl">
          <h3 id="invitation-title">{`${t(
            'INVITATION_title'
          )} ${'title comes here'}`}</h3>

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

export default Dashboard
