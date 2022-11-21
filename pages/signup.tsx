import { Box, Button, Link, TextField, Typography } from '@mui/material'
import { useTranslation } from '../hooks/use-translation'
import { CondensedContainer } from '../components/condensed-container'
import { fetchJson } from '../lib/helpers/fetch-json'
import { Formik } from 'formik'
import { SignupType } from '../components/products/types'
import { signupFormSchema } from '../lib/schema/signup-form-schema'

const formGroupSX = { mb: 2 }

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
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('SIGNUP_title')}
      </Typography>
      <Formik
        initialValues={
          {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
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
                required
              />

              <TextField
                sx={formGroupSX}
                name="lastName"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.lastName}
                error={!!props.errors.lastName}
                helperText={props.errors.lastName}
                type="text"
                label={t('GLOBAL_last_name')}
                variant="outlined"
                required
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
                required
              />

              <TextField
                sx={formGroupSX}
                name="phone"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.phone}
                error={!!props.errors.phone}
                helperText={props.errors.phone}
                type="tel"
                label={t('GLOBAL_mobile_number')}
                variant="outlined"
                required
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
                required
              />
            </Box>

            <Button type="submit" variant="contained">
              {t('SIGNUP_signup')}
            </Button>

            <Box sx={{ mt: 3 }}>
              <Link underline="hover" href="/login">
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
