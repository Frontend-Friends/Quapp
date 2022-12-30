import React, { useState } from 'react'
import { Box, Snackbar, TextField, Typography } from '@mui/material'
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

const twFormGroup = 'mb-4'

const AccountSettings: React.FC<{ isLoggedIn: boolean; user: User }> = ({
  ...props
}) => {
  const [isLoading, setIsLoading] = useState({
    updateAccount: false,
    resetPassword: false,
  })
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = useState('')
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
        setOpen(true)
        setMessage('SETTINGS_updated')
      }
    } catch {
      setIsLoading({ ...isLoading, updateAccount: false })
      setOpen(true)
      setMessage('SETTINGS_failed')
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
      } else {
        setOpen(true)
        setMessage(t('LOGIN_password_has_been_reset'))
        setIsLoading({ ...isLoading, resetPassword: false })
      }
    } catch {
      setIsLoading({ ...isLoading, resetPassword: true })
      setMessage('LOGIN_server_error')
      setIsLoading({ ...isLoading, resetPassword: false })
    }
  }
  // todo add pre-filled values
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
                helperText={formikProps.errors.firstName}
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
                helperText={formikProps.errors.lastName}
                type="text"
                label={t('GLOBAL_last_name')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="phone"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.phone}
                error={!!formikProps.errors.phone}
                helperText={formikProps.errors.phone}
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={t(message)}
      />
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
