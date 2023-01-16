import React, { FC, useState } from 'react'
import { CondensedContainer } from '../condensed-container'
import { Header } from '../header'
import { Box, Fab, Grid, IconButton, Modal, Typography } from '@mui/material'
import SpaceItem from '../spaces/space-item'
import AddIcon from '@mui/icons-material/Add'
import SpaceForm from '../../pages/community/space-form'
import { SpaceItemTypeWithUser } from '../products/types'
import { UseTranslationType } from '../../hooks/use-translation'
import EditSpaceModal from '../spaces/edit-space-modal'
import { useSnackbar } from '../../hooks/use-snackbar'
import { User } from '../user/types'
import CloseIcon from '@mui/icons-material/Close'

export const Dashboard: FC<{
  spaces?: SpaceItemTypeWithUser[]
  user: User
  t: UseTranslationType
}> = ({ spaces, user, t }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [mySpaces, setMySpaces] = useState<SpaceItemTypeWithUser[]>(
    spaces ?? []
  )
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [space, setSpace] = useState<SpaceItemTypeWithUser | null>(null)
  const setAlert = useSnackbar((state) => state.setAlert)
  return (
    <CondensedContainer className="relative">
      <Header title={t('SPACES_title')} />
      {!!mySpaces?.length ? (
        <Grid container columns={{ md: 1 }} spacing={{ xs: 4 }} pt={4}>
          {mySpaces.map((mySpace) => {
            const isOwner = mySpace.adminId === user.id

            return (
              <SpaceItem
                key={`${mySpace.creationDate}-${mySpace.id}`}
                space={mySpace}
                setMySpaces={setMySpaces}
                mySpaces={mySpaces}
                setOpenEditModal={setOpenEditModal}
                setSpace={setSpace}
                isOwner={isOwner}
              />
            )
          })}
        </Grid>
      ) : (
        <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
      )}
      <Fab
        color="secondary"
        aria-label="add"
        variant="extended"
        className="mt-8"
        onClick={() => {
          setOpenModal(true)
        }}
      >
        <AddIcon className="mr-2" /> {t('SPACES_add_space')}
      </Fab>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby="addspace-title"
        aria-describedby="addspace-description"
      >
        <CondensedContainer className="absolute m-0 h-full max-h-full w-full overflow-auto bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/3">
          <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
            <IconButton
              title={t('BUTTON_close')}
              className="z-10 -mt-2 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <h3 id="addspace-title" className="my-0">{`${t(
            'SPACES_add_space'
          )}`}</h3>
          <p id="addspace-description">{t('SPACES_add_space_text')}</p>
          {setOpenModal && (
            <SpaceForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              mySpaces={mySpaces}
              setMySpaces={setMySpaces}
              user={user}
              setOpenModal={setOpenModal}
            />
          )}
        </CondensedContainer>
      </Modal>

      <EditSpaceModal
        setAlert={setAlert}
        space={space}
        setSpace={setSpace}
        mySpaces={mySpaces}
        setMySpaces={setMySpaces}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        t={t}
      />
    </CondensedContainer>
  )
}
