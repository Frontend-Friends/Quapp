import { useState } from 'react'
import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { User } from '../components/user/types'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  useAsync(async () => {
    const { user: fetchedUser, ok } = await fetchJson<{ user: User }>(
      '/api/user'
    )
    if (ok) {
      setUser(fetchedUser || '')
    }
  }, [])

  return user
}
