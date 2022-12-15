import React from 'react'
import { Box, Button, Link, TextField, Typography } from '@mui/material'

import { Formik } from 'formik'
import { useTranslation } from '../../hooks/use-translation'
import { SignupType } from '../../components/products/types'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { signupFormSchema } from '../../lib/schema/signup-form-schema'
import { CondensedContainer } from '../../components/condensed-container'

const twFormGroup = 'mb-4'

const Signup: React.FC = () => {
  const handleSignup = async (values: SignupType) => {
    await fetchJson('/api/signup', {
      method: 'POST',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values }),
      cache: 'default',
    })
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

            <Button type="submit" variant="contained">
              {t('SIGNUP_signup')}
            </Button>

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
