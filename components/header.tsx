import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import Image from 'next/image'
import { useTranslation } from '../hooks/use-translation'

export const Header: FC<{
  title: string
  lead?: string
  imgSrc?: string
}> = ({ title, lead, imgSrc }) => {
  const t = useTranslation()
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
            alt={t('PRODUCT_image')}
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
