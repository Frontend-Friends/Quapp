import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Link, Snackbar, TextField, Typography } from '@mui/material'
import { CondensedContainer } from '../../components/condensed-container'
import { useTranslation } from '../../hooks/use-translation'
import { Formik } from 'formik'
import { loginFormSchema } from '../../lib/schema/login-form-schema'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../../lib/config'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { twFormGroup } from '../../lib/constants/css-classes'

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

  const invitation = router.query.invitation as string

  const calledOnce = useRef(false)

  useEffect(() => {
    if (calledOnce.current) {
      return
    }
    if (invitation)
      fetchJson<{
        message: string
        ok: boolean
        space: string
        isSignedUp?: boolean
        invitationId?: string
      }>(`/api/get-invitation?invitation=${invitation}`).then((r) => {
        if (r.ok) {
          setMessage(r.message)
          setOpen(true)
          fetchJson(`/api/delete-invitation?invitation=${invitation}`).then()
          setTimeout(() => {
            router.push(`/community/${r.space}/products`)
          }, 2000)
        }
        if (!r.isSignedUp) {
          setMessage(r.message)
          setOpen(true)
          setTimeout(() => {
            router.push(`/auth/signup?invitation=${invitation}`)
          }, 2000)
        }
      })
    // make sure the useEffect is called only once
    calledOnce.current = true
  }, [router, invitation])

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
        setMessage('RESPONSE_SERVER_ERROR')
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
