import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import Image from 'next/image'

export const Header: FC<{
  title: string
  lead?: string
  imgSrc?: string
}> = ({ title, lead, imgSrc }) => {
  return (
    <header>
      <Typography variant="h1">{title}</Typography>
      {imgSrc && (
        <Box
          sx={{ position: 'relative', width: '100%', paddingTop: '50%', mt: 2 }}
        >
          <Image
            src={imgSrc}
            layout="fill"
            objectFit="cover"
            alt="Product Image"
          />
        </Box>
      )}
      {lead && (
        <Typography variant="subtitle1" mt={2}>
          {lead}
        </Typography>
      )}
    </header>
  )
}
