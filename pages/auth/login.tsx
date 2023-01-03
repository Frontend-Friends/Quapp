import { useRouter } from 'next/router'
import React, { FC, useCallback, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'

import {
  Box,
  Link,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { CondensedContainer } from '../../components/condensed-container'
import { useTranslation } from '../../hooks/use-translation'
import { Formik } from 'formik'
import { loginFormSchema } from '../../lib/schema/login-form-schema'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../../lib/config'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { resetPasswordFormSchema } from '../../lib/schema/reset-password-form-schema'

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
  const [openModal, setOpenModal] = useState(false)

  const handleLogin = useCallback(
    async (values: { email: string; password: string }) => {
      setIsLoading(true)

      try {
        const fetchedLogin = await fetchJson('/api/login', {
          method: 'POST',
          body: JSON.stringify({ ...values }),
        })
        if (fetchedLogin.ok) {
          await router.push('/community/dashboard')
        } else {
          setOpen(true)
          setMessage(fetchedLogin.errorMessage)
          setIsLoading(false)
        }
      } catch {
        setOpen(true)
        setMessage('LOGIN_server_error')
        setIsLoading(false)
      }
    },

    [router]
  )

  const handleResetPassword = async (email: string) => {
    setIsLoading(true)
    const body = { email: email }
    const bodyString = JSON.stringify(body)
    try {
      const fetchedResetPassword = await fetchJson('/api/reset-password', {
        method: 'POST',
        body: bodyString,
      })
      if (fetchedResetPassword.ok) {
        setIsLoading(false)
        setOpenModal(false)
        setOpen(true)
      } else {
        setOpen(true)
        setMessage(t('LOGIN_password_has_been_reset'))
        setIsLoading(false)
      }
    } catch {
      setIsLoading(false)
      setMessage('LOGIN_server_error')
      setIsLoading(false)
    }
  }

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
              <Link
                underline="hover"
                href="#"
                className="mr-4"
                onClick={() => setOpenModal(true)}
              >
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
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <CondensedContainer className="absolute top-1/2 left-1/2 m-0 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 drop-shadow-2xl">
          <h3 id="reset-title">{`${t('RESET_title')}`}</h3>
          <p id="reset-description">{t('RESET_text')}</p>
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={resetPasswordFormSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values) => {
              await handleResetPassword(values.email)
            }}
          >
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit}>
                <Box className="grid grid-cols-2 gap-4">
                  <TextField
                    className={twFormGroup}
                    name="email"
                    type="text"
                    label={t('GLOBAL_email')}
                    variant="outlined"
                    value={formikProps.values.email}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    helperText={formikProps.errors.email}
                    error={!!formikProps.errors.email}
                  />
                </Box>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                >
                  {t('RESET_submit_button')}
                </LoadingButton>
              </form>
            )}
          </Formik>
        </CondensedContainer>
      </Modal>
    </CondensedContainer>
  )
}

export default Login
