import { FC, ReactNode } from 'react'
import { Box } from '@mui/material'

export const CondensedContainer: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        width: { xs: '90%', md: '50%', lg: '40%' },
        maxWidth: '600px',
        mx: 'auto',
        my: '10%',
      }}
    >
      {children}
    </Box>
  )
}
