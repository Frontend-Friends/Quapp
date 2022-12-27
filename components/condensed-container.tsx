import { forwardRef } from 'react'
import { Box, BoxProps } from '@mui/material'
import clsx from 'clsx'

export const CondensedContainer = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    return (
      <Box
        {...props}
        className={clsx(
          'mx-auto my-[10%] w-full max-w-3xl p-3',
          props.className
        )}
        ref={ref}
      />
    )
  }
)
