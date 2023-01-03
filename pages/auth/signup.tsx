import React, { FC, useState } from 'react'
import { Box, Link, Snackbar, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SignupType } from '../../components/products/types'
import { signupFormSchema } from '../../lib/schema/signup-form-schema'
import { CondensedContainer } from '../../components/condensed-container'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { sendFormData } from '../../lib/helpers/send-form-data'

const twFormGroup = 'mb-4'

const Signup: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignup = async (values: SignupType) => {
    setIsLoading(true)
    try {
      const fetchedSignup = await sendFormData('/api/signup', values)

      if (fetchedSignup.ok) {
        setIsLoading(false)
        await router.push({
          pathname: '/auth/signup-success',
          query: { name: values.firstName },
        })
      } else {
        setOpen(true)
        setMessage(fetchedSignup.errorMessage)
        setIsLoading(false)
      }
    } catch {
      setIsLoading(false)
      setOpen(true)
      setMessage('SIGNUP_failed')
    }
  }
  const t = useTranslation()
  return (
    <CondensedContainer>
      <Typography variant="h1" className="my-6">
        {t('SIGNUP_title')}
      </Typography>
      <Formik
        initialValues={
          {
            firstName: '',
            email: '',
            password: '',
          } as SignupType
        }
        validationSchema={signupFormSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSignup}
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
                name="email"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.email}
                error={!!props.errors.email}
                helperText={props.errors.email}
                type="email"
                label={t('GLOBAL_email')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.password}
                error={!!props.errors.password}
                helperText={props.errors.password}
                type="password"
                label={t('GLOBAL_password')}
                variant="outlined"
              />
            </Box>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              {t('SIGNUP_signup')}
            </LoadingButton>

            <Box className="mt-6">
              <Link underline="hover" href="/auth/login">
                {t('LOGIN_has_account')}
              </Link>
            </Box>
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

export default Signup
