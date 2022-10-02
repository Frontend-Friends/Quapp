import { FC, forwardRef, ReactNode } from 'react'
import { Box, BoxProps } from '@mui/material'

export const CondensedContainer = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    return (
      <Box
        {...props}
        sx={{
          width: { xs: '90%', md: '50%', lg: '40%' },
          maxWidth: '600px',
          mx: 'auto',
          my: '10%',
          ...props.sx,
        }}
        ref={ref}
      />
    )
  }
)
