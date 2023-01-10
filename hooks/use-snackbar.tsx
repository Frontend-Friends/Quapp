import { AlertColor } from '@mui/material'
import { ReactNode } from 'react'
import create from 'zustand'

type SnackbarProps = { severity: AlertColor; children: ReactNode }

export const useSnackbar = create<{
  alert: SnackbarProps | undefined
  setAlert: (newState?: SnackbarProps) => void
}>()((set) => ({
  alert: undefined,
  setAlert: (newState) =>
    set(() => ({ alert: newState ? { ...newState } : undefined })),
}))
