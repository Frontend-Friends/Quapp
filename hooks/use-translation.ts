import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { translations } from '../mock/translations/translations'
import { translationsEn } from '../mock/translations/translations-en'

export const useTranslation = () => {
  const { locale } = useRouter()
  return useCallback(
    (key: string) => {
      switch (locale) {
        case 'de':
          return translations[key] || key
        case 'en':
          return translationsEn[key] || key
        default:
          return translations[key] || key
      }
    },
    [locale]
  )
}
