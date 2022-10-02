import React, { FormEvent } from 'react'

const Unauthorized: React.FC = () => {
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    const email: string = e.target[0].value
    const password: string = e.target[1].value

    const data = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'default',
    })
  }
  const handleLogin = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const email: string = e.target[0].value
    const password: string = e.target[1].value

    const data = await fetch('/api/login', {
      method: 'POST',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'default',
    })
  }

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault()
    const data = await fetch(' /api/logout')
      .then((response) => response.json())
      .then((json) => console.log(json))
  }

  return (
    <>
      Unauthorized content
      <form onSubmit={handleLogin}>
        <br />
        <input name="email" defaultValue="lkerbage@gmx.net" />{' '}
        <input name="password" defaultValue="123456" />
        <button type="submit">login</button>
        <br />
      </form>
      <br />
      <form onSubmit={handleSignup}>
        <br />
        <input name="email" defaultValue="lkerbage@gmx.net" />{' '}
        <input name="password" defaultValue="123456" />
        <button type="submit">Signup</button>
      </form>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Unauthorized
