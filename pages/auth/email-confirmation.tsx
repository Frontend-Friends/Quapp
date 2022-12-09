import React from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { CondensedContainer } from '../../components/condensed-container'
import { Typography } from '@mui/material'
import { fetchJson } from '../../lib/helpers/fetch-json'

const EmailConfirmation: React.FC = () => {
  const t = useTranslation()
  // verification of emailLink cannot be done since isSignInWithEmailLink() needs auth as aprameter which should is not be available in the frontend

  const emailConfirmation = async () => {
    try {
      const email = localStorage.getItem('emailForSignIn')
      if (!email) {
        window.prompt('Please provide your email for confirmation')
      }
      return await fetchJson('/api/email-confirmation')
    } catch {
      console.error('error in emailConfirmation in landing page')
    }
  }
  emailConfirmation().then()

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
