import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, IconButton, Link, Modal, TextField } from '@mui/material'
import { CondensedContainer } from '../../components/condensed-container'
import { useTranslation } from '../../hooks/use-translation'
import { Formik } from 'formik'
import { loginFormSchema } from '../../lib/schema/login-form-schema'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../../lib/config'
import { fetchJson } from '../../lib/helpers/fetch-json'

import { resetPasswordFormSchema } from '../../lib/schema/reset-password-form-schema'
import { useSnackbar } from '../../hooks/use-snackbar'
import { Header } from '../../components/header'
import CloseIcon from '@mui/icons-material/Close'

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
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const setAlert = useSnackbar((state) => state.setAlert)
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
          setAlert({ severity: 'success', children: r.message })
          fetchJson(`/api/delete-invitation?invitation=${invitation}`).then()
          setTimeout(() => {
            router.push(`/community/${r.space}/products`)
          }, 2000)
        }
        if (!r.isSignedUp) {
          setAlert({ severity: 'error', children: r.message })
          setTimeout(() => {
            router.push(`/auth/signup?invitation=${invitation}`)
          }, 2000)
        }
      })
    // make sure the useEffect is called only once
    calledOnce.current = true
  }, [router, invitation, setAlert])

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
          setAlert({ severity: 'error', children: fetchedLogin.errorMessage })
          setIsLoading(false)
        }
      } catch {
        setAlert({ severity: 'error', children: t('RESPONSE_SERVER_ERROR') })
        setIsLoading(false)
      }
    },

    [router, setAlert, t]
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
      } else {
        setAlert({
          severity: 'error',
          children: t('LOGIN_password_has_been_reset'),
        })
        setIsLoading(false)
      }
    } catch {
      setIsLoading(false)
      setAlert({ severity: 'error', children: t('LOGIN_server_error') })
      setIsLoading(false)
    }
  }

  return (
    <CondensedContainer>
      <Header title={t('LOGIN_title')} titleSpacingClasses="mb-4" />
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
                helperText={t(props.errors.email || '')}
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
                helperText={t(props.errors.password || '')}
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
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
      >
        <CondensedContainer className="absolute m-0 h-full w-full bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/3">
          <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
            <IconButton
              title={t('BUTTON_close')}
              className="z-10 -mt-2 -mr-2 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <h3 id="reset-title" className="my-0">{`${t('RESET_title')}`}</h3>

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
                <Box className="grid grid-cols-1 gap-4">
                  <TextField
                    className={twFormGroup}
                    name="email"
                    type="text"
                    label={t('GLOBAL_email')}
                    variant="outlined"
                    value={formikProps.values.email}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    helperText={t(formikProps.errors.email || '')}
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
