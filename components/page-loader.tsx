import { Box, CircularProgress } from '@mui/material'
import React, { HTMLProps, PropsWithoutRef } from 'react'
import clsx from 'clsx'

export const PageLoader = ({
  isLoading,
  ...rest
}: {
  isLoading: boolean
} & PropsWithoutRef<HTMLProps<HTMLDivElement>>) => {
  return isLoading ? (
    <Box
      {...rest}
      className={clsx(
        'flex items-center justify-center bg-gray-900/40',
        rest.className
      )}
    >
      <CircularProgress />
    </Box>
  ) : null
}
