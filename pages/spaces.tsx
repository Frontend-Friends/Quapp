import React from 'react'
import { CondensedContainer } from '../components/condensed-container'
import { useTranslation } from '../hooks/use-translation'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'
import { SPACES_MOCK } from '../mock/spaces-mock'
import { Header } from '../components/header'

const Spaces: React.FC = () => {
  const t = useTranslation()

  return (
    <CondensedContainer>
      <Header title={t('SPACES_title')} />
      <Grid container columns={{ sm: 2, md: 3 }} spacing={{ xs: 4 }} pt={4}>
        {SPACES_MOCK.length === 0 && (
          <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
        )}
        {SPACES_MOCK.map((space) => (
          <Grid item xs={1} key={space.id} sx={{ flexGrow: '1' }}>
            <Card variant="outlined">
              <CardHeader title={space.name} />
              <CardContent>
                {space.memberCount && (
                  <Typography variant="body2">
                    {t('SPACES_members')}: {space.memberCount}
                  </Typography>
                )}
                {space.itemCount && (
                  <Typography variant="body2">
                    {t('SPACES_items')}: {space.itemCount}
                  </Typography>
                )}
              </CardContent>
              <CardActions>Settings</CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CondensedContainer>
  )
}

export default Spaces
