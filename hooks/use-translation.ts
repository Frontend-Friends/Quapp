import { useCallback } from 'react'
import { translations } from '../mock/translations/translations'

export const useTranslation = () => {
  return useCallback((key: string) => {
    return translations[key] || key
  }, [])
}
