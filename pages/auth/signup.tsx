import React, { useState } from 'react'
import { Box, Link, Snackbar, TextField, Typography } from '@mui/material'

import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SignupType } from '../../components/products/types'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { signupFormSchema } from '../../lib/schema/signup-form-schema'
import { CondensedContainer } from '../../components/condensed-container'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'

const formGroupSX = { mb: 2 }

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignup = async (values: SignupType) => {
    setIsLoading(true)
    try {
      const fetchedSignup = await fetchJson<{
        isSignedUp: boolean
        message: string
      }>('/api/signup', {
        method: 'POST',
        headers: {
          accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values }),
        cache: 'default',
      })

      if (fetchedSignup.isSignedUp) {
        await router.push({
          pathname: '/auth/signup-success',
          query: { name: values.firstName },
        })
      } else {
        setOpen(true)
        setMessage(fetchedSignup.message)
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
      <Typography variant="h1" sx={{ my: 3 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                sx={formGroupSX}
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
                sx={formGroupSX}
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
                sx={formGroupSX}
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

            <Box sx={{ mt: 3 }}>
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
