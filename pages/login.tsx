import { useRouter } from 'next/router'
import React, { FC, FormEvent, FormEventHandler, useState } from 'react'
import Button from '@mui/material/Button'
import { Box, Link, TextField, Typography } from '@mui/material'
import { CondensedContainer } from '../components/condensed-container'
import { useTranslation } from '../hooks/use-translation'
import { fetchJson } from '../lib/helpers/fetch-json'

const formGroupSX = { mb: 2 }

const Login: FC = () => {
  const router = useRouter()

  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    await fetch('/api/login', {
      method: 'POST',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
      cache: 'default',
    }).then((res) => {
      if (res.ok) {
        router.push('/dashboard')
      }
    })
  }

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(' /api/logout')
      .then((response) => response.json())
      .then((json) => console.log(json))
  }

  const t = useTranslation()
  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('LOGIN_title')}
      </Typography>
      <Button
        onClick={async () => {
          await fetchJson('/api/mock-user')
        }}
      >
        Mock User
      </Button>
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
            name="email"
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
            name="password"
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
          <Link underline="hover" href="/signup">
            {t('LOGIN_has_no_account')}
          </Link>
        </Box>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </CondensedContainer>
  )
}

export default Login
