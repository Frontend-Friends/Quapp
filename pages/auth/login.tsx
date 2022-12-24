import { useRouter } from 'next/router'
import React, { FC, useCallback, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'

import { Box, Link, Snackbar, TextField, Typography } from '@mui/material'
import { CondensedContainer } from '../../components/condensed-container'
import { useTranslation } from '../../hooks/use-translation'
import { Formik } from 'formik'
import { loginFormSchema } from '../../lib/schema/login-form-schema'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../../lib/config'
import { fetchJson } from '../../lib/helpers/fetch-json'

const twFormGroup = 'mb-4'

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { user } = req.session
  return {
    props: { isLoggedIn: !!user },
  }
}, ironOptions)

const Login: FC = () => {
  const router = useRouter()
  const t = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = useCallback(
    async (values: { email: string; password: string }) => {
      setIsLoading(true)

      try {
        const fetchedLogin = await fetchJson<{
          session: boolean
          message: string
        }>('/api/login', {
          method: 'POST',
          headers: {
            accept: 'application.json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...values }),
          cache: 'default',
        })
        if (fetchedLogin.session) {
          setIsLoading(false)
          await router.push('/community/dashboard')
          await setIsLoading(false)
        } else {
          setOpen(true)
          setMessage(fetchedLogin.message)
        }
      } catch {
        setOpen(true)
        setMessage('LOGIN_server_error')
        setIsLoading(false)
      }
    },

    [router]
  )

  return (
    <CondensedContainer>
      <Typography variant="h1" className="my-6">
        {t('LOGIN_title')}
      </Typography>
      <Formik
        initialValues={
          { email: '', password: '' } as {
            email: string
            password: string
          }
        }
        validationSchema={loginFormSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleLogin}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Box className="flex flex-col">
              <TextField
                className={twFormGroup}
                name="email"
                value={props.values.email}
                onChange={props.handleChange}
                error={!!props.errors.email}
                helperText={props.errors.email}
                onBlur={props.handleBlur}
                type="email"
                label={t('GLOBAL_email')}
                variant="outlined"
              />

              <TextField
                className={twFormGroup}
                name="password"
                value={props.values.password}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                helperText={props.errors.password}
                error={!!props.errors.password}
                type="password"
                label={t('GLOBAL_password')}
                variant="outlined"
              />
            </Box>
            <LoadingButton
              type="submit"
              variant="contained"
              className="mr-4"
              loading={isLoading}
            >
              {t('LOGIN_login')}
            </LoadingButton>
            <Box className="mt-6">
              <Link underline="hover" href="#" className="mr-4">
                {t('LOGIN_forgot_password')}
              </Link>
              <Link underline="hover" href="/auth/signup">
                {t('LOGIN_has_no_account')}
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

export default Login
