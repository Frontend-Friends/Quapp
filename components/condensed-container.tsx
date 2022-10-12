import { forwardRef } from 'react'
import { Box, BoxProps } from '@mui/material'

export const CondensedContainer = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    return (
      <Box
        {...props}
        sx={{
          width: '100%',
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
