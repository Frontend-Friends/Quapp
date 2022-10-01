import { useRouter } from 'next/router'
import { FC, FormEventHandler, useState } from 'react'
import Button from '@mui/material/Button'
import { Box, FormGroup, TextField, Typography } from '@mui/material'
import { useAuth } from '../components/context/auth-context'

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

  return (
    <Box
      sx={{
        width: { xs: '90%', md: '50%', lg: '40%' },
        maxWidth: '600px',
        mx: 'auto',
        my: '10%',
      }}
    >
      <Typography variant="h1">Login</Typography>
      <form onSubmit={handleLogin}>
        <FormGroup sx={{ my: 2 }}>
          <TextField
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
            required
            type="email"
            label="E-Mail"
            variant="outlined"
          />
        </FormGroup>

        <FormGroup sx={{ my: 2 }}>
          <TextField
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
            required
            type="password"
            label="Password"
            variant="outlined"
          />
        </FormGroup>
        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
    </Box>
  )
}

export default Login
