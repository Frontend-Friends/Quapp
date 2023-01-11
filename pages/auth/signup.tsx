import React, { FC, useState } from 'react'
import { Box, Link, TextField } from '@mui/material'
import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SignupType } from '../../components/products/types'
import { signupFormSchema } from '../../lib/schema/signup-form-schema'
import { CondensedContainer } from '../../components/condensed-container'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { sendFormData } from '../../lib/helpers/send-form-data'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { twFormGroup } from '../../lib/constants/css-classes'
import { useSnackbar } from '../../hooks/use-snackbar'
import { Header } from '../../components/header'

const Signup: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setAlert = useSnackbar((state) => state.setAlert)
  const t = useTranslation()

  const handleSignup = async (values: SignupType) => {
    setIsLoading(true)
    try {
      const fetchedSignup = await sendFormData('/api/signup', values)

      if (fetchedSignup.ok) {
        setIsLoading(false)
        const invitationRes = await fetchJson<{
          ok: boolean
          invitationId: string
        }>(`/api/get-invitation-id?email=${values.email}`)
        if (invitationRes?.invitationId) {
          const invitationId = invitationRes.invitationId
          await fetchJson(`/api/get-invitation?invitation=${invitationId}`)
          await fetchJson(
            `/api/delete-invitation?invitation=${invitationId}`
          ).then()
        }
        await router.push({
          pathname: '/auth/signup-success',
          query: { name: values.firstName },
        })
      } else {
        setAlert({ severity: 'error', children: fetchedSignup.errorMessage })
        setIsLoading(false)
      }
    } catch {
      setIsLoading(false)
      setAlert({ severity: 'error', children: t('SIGNUP_failed') })
    }
  }
  return (
    <CondensedContainer>
      <Header title={t('SIGNUP_title')} titleSpacingClasses="mb-4" />
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
    </CondensedContainer>
  )
}

export default Signup
