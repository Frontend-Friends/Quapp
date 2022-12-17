import React, { useState } from 'react'
import { Box, Button, Snackbar, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SettingType } from '../../components/user/types'
import { CondensedContainer } from '../../components/condensed-container'
import { LoadingButton } from '@mui/lab'
import { settingsFormSchema } from '../../lib/schema/settings-form-schema'

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
  return (
    <CondensedContainer>
      <Typography variant="h1" className="my-6">
        {t('SETTINGS_title')}
      </Typography>
      <Formik
        initialValues={
          {
            firstName: '',
            lastName: '',
            phone: '',
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

              <Button>Reset Password</Button>
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
