import { useRouter } from 'next/router'
import React, { FC, FormEventHandler, useState } from 'react'
import Button from '@mui/material/Button'
import { Box, Link, TextField, Typography } from '@mui/material'
import { useAuth } from '../components/auth-context'
import { CondensedContainer } from '../components/condensed-container'
import { useTranslation } from '../hooks/use-translation'

const formGroupSX = { mb: 2 }

const Login: FC = () => {
  const router = useRouter()
  // @ts-ignore
  const { user, login } = useAuth()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      await login(data.email, data.password)
      console.log('user is', user)
      await router.push('/dashboard')
    } catch (err) {
      console.error('error is', err)
    }
  }

  const t = useTranslation()
  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('LOGIN_title')}
      </Typography>
      <form onSubmit={handleLogin}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
        <Button type="submit" variant="contained" sx={{ mr: 2 }}>
          {t('LOGIN_login')}
        </Button>
        <Box sx={{ mt: 3 }}>
          <Link underline="hover" href="#" sx={{ mr: 2 }}>
            {t('LOGIN_forgot_password')}
          </Link>
          <Link underline="hover" href="#">
            {t('LOGIN_has_no_account')}
          </Link>
        </Box>
      </form>
    </CondensedContainer>
  )
}

export default Login
