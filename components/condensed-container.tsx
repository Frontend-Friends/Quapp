import { forwardRef } from 'react'
import { Box, BoxProps } from '@mui/material'

export const CondensedContainer = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    return (
      <Box {...props} className="mx-auto my-[10%] w-full max-w-3xl" ref={ref} />
    )
  }
)
