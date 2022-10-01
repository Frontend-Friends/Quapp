import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import Button from '@mui/material/Button'
import { FormGroup, Input } from '@mui/material'
import { useAuth } from '../components/context/auth-context'

const Login: FC = () => {
  const router = useRouter()
  const { user, login } = useAuth()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await login(data.email, data.password)
      console.log('user is', user)
      router.push('/dashboard')
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
      <h1 className="text-center my-3 ">Login</h1>
      <form onSubmit={handleLogin}>
        <FormGroup className="mb-3">
          <label>Email address</label>
          <Input
            onChange={(e: any) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
            required
            type="email"
            placeholder="Enter email"
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <label>Password</label>
          <Input
            onChange={(e: any) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
            required
            type="password"
            placeholder="Password"
          />
        </FormGroup>
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}

export default Login
