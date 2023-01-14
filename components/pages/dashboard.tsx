import { FC, useState } from 'react'
import { CondensedContainer } from '../condensed-container'
import { Header } from '../header'
import { Fab, Grid, Snackbar, Typography } from '@mui/material'
import SpaceItem from '../spaces/space-item'
import AddIcon from '@mui/icons-material/Add'
import SpaceForm from '../../pages/community/space-form'
import { SpaceItemTypeWithUser } from '../products/types'
import { UseTranslationType } from '../../hooks/use-translation'
import EditSpaceModal from '../spaces/edit-space-modal'
import { User } from '../user/types'

export const Dashboard: FC<{
  spaces?: SpaceItemTypeWithUser[]
  user: User
  t: UseTranslationType
}> = ({ spaces, t, user }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mySpaces, setMySpaces] = useState<SpaceItemTypeWithUser[]>(
    spaces ?? []
  )
  const [message, setMessage] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [space, setSpace] = useState<SpaceItemTypeWithUser | null>(null)

  return (
    <CondensedContainer className="relative">
      <Header title={t('SPACES_title')} />
      {!!mySpaces?.length ? (
        <Grid container columns={{ md: 1 }} spacing={{ xs: 4 }} pt={4}>
          {mySpaces.map((mySpace) => {
            return (
              <SpaceItem
                key={`${mySpace.creationDate}`}
                space={mySpace}
                setMySpaces={setMySpaces}
                mySpaces={mySpaces}
                setSnackbarOpen={setSnackbarOpen}
                setMessage={setMessage}
                setOpenModal={setOpenModal}
                setSpace={setSpace}
              />
            )
          })}
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
          mySpaces={mySpaces}
          setMySpaces={setMySpaces}
        />
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={t(message)}
      />
      <EditSpaceModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        space={space}
        setSpace={setSpace}
        t={t}
        user={user}
      />
    </CondensedContainer>
  )
}
