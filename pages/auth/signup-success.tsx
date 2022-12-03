import React from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { CondensedContainer } from '../../components/condensed-container'
import { Link, Typography } from '@mui/material'
import Button from '@mui/material/Button'

const SignupSuccess: React.FC = () => {
  const t = useTranslation()

  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('SIGNUP_title_success')}
      </Typography>
      <p>
        Vielen Dank für deine Registrierung! Wir haben dir eine E-Mail mit einem
        Verifizierungslink geschickt. Bitte klicke diesen um die Registrierung
        abzuschliessen.
      </p>
      <Button
        href="login"
        component="a"
        LinkComponent={Link}
        color="primary"
        variant="contained"
      >
        {t('GLOBAL_backtologin')}
      </Button>
    </CondensedContainer>
  )
}

export default SignupSuccess
