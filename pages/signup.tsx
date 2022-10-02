import React, { FormEventHandler, useState } from 'react'
import { useAuth } from '../components/auth-context'
import { Button, FormGroup, Input } from '@mui/material'

const Signup: React.FC = () => {
  // @ts-ignore
  const { user, signup } = useAuth()
  console.log(user)
  const [data, setData] = useState({
    email: '',
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

  return (
    <div
      style={{
        width: '40%',
        margin: 'auto',
      }}
    >
      <h1 className="text-center my-3 ">Signup</h1>
      <form onSubmit={handleSignup}>
        <FormGroup className="mb-3">
          <label>Email address</label>
          <Input
            type="email"
            placeholder="Enter email"
            required
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <label>Password</label>
          <Input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
          />
        </FormGroup>

        <Button type="submit">Signup</Button>
      </form>
    </div>
  )
}

export default Signup
