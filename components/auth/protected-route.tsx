import React, { FC, ReactNode, useEffect } from 'react'
import { useAuth } from '../context/auth-context'
import { useRouter } from 'next/router'

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  // @ts-ignore
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login').then()
    }
  }, [router, user])
  return <>{user ? children : null}</>
}

export default ProtectedRoute
