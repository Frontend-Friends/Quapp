import React, { FormEventHandler, useState } from 'react'
import { useAuth } from '../components/auth-context'
import { Box, Button, Link, TextField, Typography } from '@mui/material'
import { useTranslation } from '../hooks/use-translation'
import { CondensedContainer } from '../components/condensed-container'

const formGroupSX = { mb: 2 }

const Signup: React.FC = () => {
  // @ts-ignore
  const { user, signup } = useAuth()
  console.log(user)
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleSignup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      await signup(data.email, data.password)
    } catch (err) {
      console.log(err)
    }
    console.log(data)
  }

  const t = useTranslation()
  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('SIGNUP_title')}
      </Typography>
      <form onSubmit={handleSignup}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            sx={formGroupSX}
            onChange={(e) =>
              setData({
                ...data,
                firstName: e.target.value,
              })
            }
            value={data.firstName}
            required
            type="text"
            label={t('GLOBAL_first_name')}
            variant="outlined"
          />

          <TextField
            sx={formGroupSX}
            onChange={(e) =>
              setData({
                ...data,
                lastName: e.target.value,
              })
            }
            value={data.lastName}
            required
            type="text"
            label={t('GLOBAL_last_name')}
            variant="outlined"
          />

          <TextField
            sx={formGroupSX}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
            required
            type="email"
            label={t('GLOBAL_email')}
            variant="outlined"
          />

          <TextField
            sx={formGroupSX}
            onChange={(e) =>
              setData({
                ...data,
                phone: e.target.value,
              })
            }
            value={data.phone}
            required
            type="tel"
            label={t('GLOBAL_mobile_number')}
            variant="outlined"
          />

          <TextField
            sx={formGroupSX}
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
            required
            type="password"
            label={t('GLOBAL_password')}
            variant="outlined"
          />
        </Box>

        <Button type="submit" variant="contained">
          {t('SIGNUP_signup')}
        </Button>

        <Box sx={{ mt: 3 }}>
          <Link underline="hover" href="#">
            {t('LOGIN_has_account')}
          </Link>
        </Box>
      </form>
    </CondensedContainer>
  )
}

export default Signup
