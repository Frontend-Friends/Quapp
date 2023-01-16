import { forwardRef } from 'react'
import { Box, BoxProps } from '@mui/material'
import clsx from 'clsx'

export const CondensedContainer = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    return (
      <Box
        {...props}
        className={clsx(
          'mx-auto w-full max-w-3xl p-4 pb-8 md:p-8',
          props.className
        )}
        ref={ref}
      />
    )
  }
)
