import { useRouter } from 'next/router'
import { FC, FormEventHandler, useState } from 'react'
import Button from '@mui/material/Button'
import { FormGroup, Input, TextField } from '@mui/material'
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
    <div
      style={{
        width: '40%',
        margin: 'auto',
      }}
    >
      <h1>Login</h1>
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
    </div>
  )
}

export default Login
