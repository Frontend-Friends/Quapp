import React from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { CondensedContainer } from '../../components/condensed-container'
import { Link, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const SignupSuccess: React.FC = () => {
  const t = useTranslation()
  const router = useRouter()
  const { name } = router.query

  return (
    <CondensedContainer>
      <Typography variant="h1" sx={{ my: 3 }}>
        {t('GLOBAL_hello')} {name}!
      </Typography>
      {/*todo translate*/}
      <p>{t('SIGNUP_success_page_text')}</p>
      <Link href="login">
        <Button color="primary" variant="contained">
          {t('GLOBAL_back_to_login')}
        </Button>
      </Link>
    </CondensedContainer>
  )
}

export default SignupSuccess
