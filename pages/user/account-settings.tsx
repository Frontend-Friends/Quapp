import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SettingType, User } from '../../components/user/types'
import { CondensedContainer } from '../../components/condensed-container'
import { LoadingButton } from '@mui/lab'
import { settingsFormSchema } from '../../lib/schema/settings-form-schema'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../../lib/config'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { twFormGroup } from '../../lib/constants'
import { useSnackbar } from '../../hooks/use-snackbar'

const AccountSettings: React.FC<{ isLoggedIn: boolean; user: User }> = ({
  ...props
}) => {
  const [isLoading, setIsLoading] = useState({
    updateAccount: false,
    resetPassword: false,
    deleteAccount: false,
  })
  const setAlert = useSnackbar((state) => state.setAlert)
  const [dialogOpen, setDialogOpen] = useState(false)

  const t = useTranslation()
  if (!props.user) {
    alert('middleware richtig konfigurieren')
    return null
  }
  const handleChangeSettings = async (values: SettingType) => {
    try {
      setIsLoading({ ...isLoading, updateAccount: true })
      const result = await sendFormData(`/api/account-settings`, values)
      if (result.ok) {
        setIsLoading({ ...isLoading, updateAccount: false })
        setAlert({ severity: 'success', children: t('SETTINGS_updated') })
      }
    } catch {
      setIsLoading({ ...isLoading, updateAccount: false })
      setAlert({ severity: 'error', children: t('SETTINGS_failed') })
    }
  }
  const handleResetPassword = async (email: string) => {
    const body = { email: email }
    const bodyString = JSON.stringify(body)
    try {
      const fetchedResetPassword = await fetchJson('/api/reset-password', {
        method: 'POST',
        body: bodyString,
      })
      if (fetchedResetPassword.ok) {
        setIsLoading({ ...isLoading, updateAccount: false })
        setAlert({
          severity: 'success',
          children: t('LOGIN_password_has_been_reset'),
        })
      } else {
        setAlert({
          severity: 'error',
          children: t('LOGIN_password_reset_failed'),
        })
        setIsLoading({ ...isLoading, resetPassword: false })
      }
    } catch {
      setIsLoading({ ...isLoading, resetPassword: true })
      setAlert({ severity: 'error', children: t('LOGIN_server_error') })
      setIsLoading({ ...isLoading, resetPassword: false })
    }
  }
  const handleDeleteAccount = async (userId: string) => {
    try {
      const fetchedDeleteUser = await fetchJson<{
        ok: boolean
        message: string
        errorMessage: string
      }>(`/api/delete-account?${userId}`)
      if (fetchedDeleteUser.ok) {
        setIsLoading({ ...isLoading, deleteAccount: false })
        setAlert({
          severity: 'success',
          children: t(fetchedDeleteUser.message),
        })
        // setTimeout(async () => {
        //   await router.push('/auth/login')
        // }, 1500)
      } else {
        setAlert({
          severity: 'error',
          children: t(fetchedDeleteUser.errorMessage),
        })
        setIsLoading({ ...isLoading, deleteAccount: false })
      }
    } catch {
      setIsLoading({ ...isLoading, deleteAccount: true })
      setAlert({
        severity: 'error',
        children: t('RESPONSE_SERVER_ERROR'),
      })
      setIsLoading({ ...isLoading, deleteAccount: false })
    }
  }
  return (
    <CondensedContainer>
      <Typography variant="h1" className="my-6">
        {t('SETTINGS_title')}
      </Typography>
      <Formik
        initialValues={
          {
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            phone: props.user.phone,
            userName: props.user.userName,
          } as SettingType
        }
        validationSchema={settingsFormSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) =>
          handleChangeSettings({ ...values, uid: props.user.id ?? '' })
        }
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <Box className="flex flex-col">
              <TextField
                className={twFormGroup}
                name="firstName"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.firstName}
                error={!!formikProps.errors.firstName}
                helperText={t(formikProps.errors.firstName || '')}
                type="text"
                label={t('GLOBAL_first_name')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="lastName"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.lastName}
                error={!!formikProps.errors.lastName}
                helperText={t(formikProps.errors.lastName || '')}
                type="text"
                label={t('GLOBAL_last_name')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="userName"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.userName}
                error={!!formikProps.errors.userName}
                helperText={t(formikProps.errors.userName || '')}
                type="text"
                label={t('GLOBAL_user_name')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="phone"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.phone}
                error={!!formikProps.errors.phone}
                helperText={t(formikProps.errors.phone || '')}
                type="text"
                label={t('GLOBAL_mobile_number')}
                variant="outlined"
              />
            </Box>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading.updateAccount}
            >
              {t('SETTINGS_change_settings')}
            </LoadingButton>
          </form>
        )}
      </Formik>
      <Typography variant="h1" className="mt-14 mb-4">
        {t('SETTINGS_change_password')}
      </Typography>
      <Typography className="mt-4 mb-4">
        {t('SETTINGS_change_password_description')}
      </Typography>
      <LoadingButton
        variant="contained"
        loading={isLoading.resetPassword}
        onClick={() => {
          handleResetPassword(props.user.email).then()
          setIsLoading({ ...isLoading, resetPassword: false })
        }}
      >
        {t('BUTTON_reset_password')}
      </LoadingButton>

      <Typography variant="h1" className="mt-14 mb-4">
        {t('SETTINGS_delete_account')}
      </Typography>
      <LoadingButton
        variant="contained"
        loading={isLoading.deleteAccount}
        onClick={() => {
          handleDeleteAccount(props.user.id ?? '').then()
          setIsLoading({ ...isLoading, deleteAccount: false })
        }}
      >
        {t('BUTTON_delete_account')}
      </LoadingButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('DELETE_text')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleDeleteAccount(props.user.id ?? '')}>
            {t('GLOBAL_yes')}
          </Button>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            {t('GLOBAL_no')}
          </Button>
        </DialogActions>
      </Dialog>
    </CondensedContainer>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { user } = req.session
  return {
    props: { isLoggedIn: !!user, user: user || null },
  }
}, ironOptions)

export default AccountSettings
