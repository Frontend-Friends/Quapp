import React, { FC, useState } from 'react'
import { CondensedContainer } from '../condensed-container'
import { Header } from '../header'
import {
  Box,
  Fab,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Typography,
} from '@mui/material'
import SpaceItem from '../spaces/space-item'
import AddIcon from '@mui/icons-material/Add'
import SpaceForm from '../../pages/community/space-form'
import { SpaceItemType } from '../products/types'
import { UseTranslationType } from '../../hooks/use-translation'
import CloseIcon from '@mui/icons-material/Close'

export const Dashboard: FC<{
  spaces?: SpaceItemType[]
  t: UseTranslationType
}> = ({ spaces, t }) => {
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mySpaces, setMySpaces] = useState<SpaceItemType[]>(spaces ?? [])
  const [message, setMessage] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)

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
        <CondensedContainer className="absolute m-0 h-full w-full bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/3">
          <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
            <IconButton
              title={t('BUTTON_close')}
              className="z-10 -mt-2 -mr-2 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <h3 id="addspace-title" className="my-0">{`${t(
            'SPACES_add_space'
          )}`}</h3>
          <p id="addspace-description">{t('SPACES_add_space_text')}</p>
          <SpaceForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            mySpaces={mySpaces}
            setMySpaces={setMySpaces}
          />
        </CondensedContainer>
      </Modal>

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
    </CondensedContainer>
  )
}
