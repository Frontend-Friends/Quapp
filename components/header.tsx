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
      <Typography
        variant="h1"
        className="text-violetRed-600 md:text-3xl lg:text-4xl"
      >
        {title}
      </Typography>
      {imgSrc && (
        <Box className="relative mt-4 w-full pt-[50%]">
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
