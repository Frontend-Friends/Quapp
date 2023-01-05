import { FC, useState } from 'react'
import { CondensedContainer } from '../condensed-container'
import { Header } from '../header'
import { Fab, Grid, Typography } from '@mui/material'
import SpaceItem from '../spaces/space-item'
import AddIcon from '@mui/icons-material/Add'
import SpaceForm from '../../pages/community/space-form'
import { SpaceItemType } from '../products/types'
import { UseTranslationType } from '../../hooks/use-translation'

export const Dashboard: FC<{
  spaces?: SpaceItemType[]
  t: UseTranslationType
}> = ({ spaces, t }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <CondensedContainer className="relative">
      <Header title={t('SPACES_title')} />
      {!!spaces?.length ? (
        <Grid container columns={{ md: 1 }} spacing={{ xs: 4 }} pt={4}>
          {spaces.map((space) => (
            <SpaceItem key={space.id} space={space} />
          ))}
        </Grid>
      ) : (
        <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
      )}
      <Fab
        color="primary"
        aria-label="add"
        variant="extended"
        className="mt-8"
        onClick={() => setOpen((state) => !state)}
      >
        <AddIcon className="mr-2" /> {t('SPACES_add_space')}
      </Fab>
      {open && (
        <SpaceForm
          setOpen={setOpen}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMessage={setMessage}
          message={message}
        />
      )}
    </CondensedContainer>
  )
}