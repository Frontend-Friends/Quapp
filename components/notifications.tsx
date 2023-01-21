import { useAsync } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { useTranslation } from '../hooks/use-translation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { messageListener } from '../lib/services/message-listener'
import { User } from './user/types'

export const Notifications = () => {
  const t = useTranslation()
  const { push } = useRouter()
  const [userId, setUserId] = useState('')

  useAsync(async () => {
    const { user, ok } = await fetchJson<{ user: User }>('/api/user')
    if (ok) {
      setUserId(user.id || '')
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      return
    }
    let allowNotifications = false
    Notification.requestPermission().then((permission) => {
      allowNotifications = permission === 'granted'
    })
    const unsubscribe = messageListener(userId, push, t, allowNotifications)

    return () => {
      unsubscribe()
    }
  }, [push, t, userId])

  return null
}
