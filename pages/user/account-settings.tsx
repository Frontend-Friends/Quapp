import React, { useState } from 'react'
import { Box, Snackbar, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SettingType } from '../../components/user/types'
import { CondensedContainer } from '../../components/condensed-container'
import { LoadingButton } from '@mui/lab'
import { settingsFormSchema } from '../../lib/schema/settings-form-schema'
import { fetchJson } from '../../lib/helpers/fetch-json'

const twFormGroup = 'mb-4'

const AccountSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = useState('')
  const t = useTranslation()

  const handleSignup = async (values: SettingType) => {
    setIsLoading(true)
    console.log(values)
    setMessage('SETTINGS_success')
  }

  const handleResetPassword = async (email: string) => {
    const fetchedResetPassword = await fetchJson<{
      isOk: boolean
    }>('/api/reset-password', {
      method: 'POST',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
      cache: 'default',
    })
    try {
      if (fetchedResetPassword.isOk) {
        setIsLoading(false)
      } else {
        setOpen(true)
        setMessage(t('PASSWORD HAS BEEN RESET'))
        setIsLoading(false)
      }
    } catch {
      setOpen(true)
      setMessage('LOGIN_server_error')
      setIsLoading(false)
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
            firstName: 'firstName from db',
            lastName: 'lastName from db',
            phone: 'phone from db',
          } as SettingType
        }
        validationSchema={settingsFormSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(e) => handleSignup(e)}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Box className="flex flex-col">
              <TextField
                className={twFormGroup}
                name="firstName"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.firstName}
                error={!!props.errors.firstName}
                helperText={props.errors.firstName}
                type="text"
                label={t('GLOBAL_first_name')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="lastName"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.lastName}
                error={!!props.errors.lastName}
                helperText={props.errors.lastName}
                type="text"
                label={t('GLOBAL_last_name')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="phone"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.phone}
                error={!!props.errors.phone}
                helperText={props.errors.phone}
                type="text"
                label={t('GLOBAL_mobile_number')}
                variant="outlined"
              />
            </Box>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              {t('SETTINGS_change_settings')}
            </LoadingButton>
          </form>
        )}
      </Formik>
      <LoadingButton
        variant="contained"
        loading={isLoading}
        onClick={() => {
          handleResetPassword('lkerbage@gmx.net').then()
          setIsLoading(true)
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

export default AccountSettings
