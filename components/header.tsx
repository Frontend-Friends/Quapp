import { Typography } from '@mui/material'
import { FC } from 'react'
import clsx from 'clsx'

export const Header: FC<{
  title: string
  titleSpacingClasses?: string
  lead?: string
  leadSpacingClasses?: string
}> = ({ title, lead, titleSpacingClasses, leadSpacingClasses }) => {
  return (
    <header>
      <Typography
        variant="h1"
        className={clsx(
          'text-3xl text-violetRed-600 lg:text-4xl',
          titleSpacingClasses
        )}
      >
        {title}
      </Typography>
      {lead && (
        <Typography
          variant="subtitle1"
          className={clsx('font-medium leading-5', leadSpacingClasses)}
        >
          {lead}
        </Typography>
      )}
    </header>
  )
}
