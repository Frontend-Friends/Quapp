import { Alert, Snackbar as SnackbarImpl } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSnackbar } from '../../hooks/use-snackbar'

export const Snackbar = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const alert = useSnackbar((state) => state.alert)
  const setAlert = useSnackbar((state) => state.setAlert)

  useEffect(() => {
    if (alert) {
      setOpenSnackbar(true)
    }
  }, [alert])

  return (
    <SnackbarImpl
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={() => {
        setOpenSnackbar(false)
        setAlert(undefined)
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert {...alert} className="items-center text-xl shadow-lg md:mt-5" />
    </SnackbarImpl>
  )
}
