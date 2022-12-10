import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { CondensedContainer } from '../../components/condensed-container'
import { Typography } from '@mui/material'
import { fetchJson } from '../../lib/helpers/fetch-json'

const EmailConfirmation: React.FC = () => {
  const t = useTranslation()
  const [email, setEmail] = useState<string | null>(null)
  const [url, setUrl] = useState<string | undefined>(undefined)

  //in order to run it client side only
  useEffect(() => {
    const emailConfirmation = async () => {
      try {
        if (!email) {
          window.prompt('Please provide your email for confirmation')
        }
        return await fetchJson(
          '/api/email-confirmation?confirmationUrl=' + url
        ).then((res) => console.log(res, 'res'))
      } catch {
        console.error('error in emailConfirmation in landing page')
      }
    }

    const userEmail = window.localStorage.getItem('emailForSignIn')
    setEmail(userEmail && userEmail)
    // window.localStorage.removeItem('emailForSignIn')
    const confirmationUrl = window.location.href
    setUrl(confirmationUrl && confirmationUrl)

    if (url) emailConfirmation().then()
  }, [url, email])
  // verification of emailLink cannot be done here since isSignInWithEmailLink() needs auth as parameter which should is not be available in the frontend

  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('GLOBAL_hello')} !
      </Typography>
      {/*todo translate*/}
      <p>Registrierung OK, du wirst gleich weitergeleitet ...</p>
    </CondensedContainer>
  )
}

export default EmailConfirmation
