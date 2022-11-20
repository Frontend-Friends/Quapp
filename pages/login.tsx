import { useRouter } from 'next/router'
import React, { FC } from 'react'
import Button from '@mui/material/Button'
import { Box, Link, TextField, Typography } from '@mui/material'
import { CondensedContainer } from '../components/condensed-container'
import { useTranslation } from '../hooks/use-translation'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../lib/config'
import { Formik } from 'formik'
import { loginFormSchema } from '../lib/schema/login-form-schema'

const formGroupSX = { mb: 2 }

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { user } = req.session
  return {
    props: { isLoggedIn: !!user },
  }
}, ironOptions)

const Login: FC = () => {
  const router = useRouter()

  const handleLogin = async (values: { email: string; password: string }) => {
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values }),
      cache: 'default',
    })
      .then((res) => {
        if (res.ok) {
          router.push('/dashboard')
        }
      })
      .catch((err) => {
        console.log(err, 'error!')
      })
  }

  const t = useTranslation()
  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                sx={formGroupSX}
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
                sx={formGroupSX}
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
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              {t('LOGIN_login')}
            </Button>
            <Box sx={{ mt: 3 }}>
              <Link underline="hover" href="#" sx={{ mr: 2 }}>
                {t('LOGIN_forgot_password')}
              </Link>
              <Link underline="hover" href="/signup">
                {t('LOGIN_has_no_account')}
              </Link>
            </Box>
          </form>
        )}
      </Formik>
    </CondensedContainer>
  )
}

export default Login
