import { Typography } from '@mui/material'
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
        <div className="relative w-full pt-[50%] mt-4">
          <Image src={imgSrc} layout="fill" objectFit="cover" />
        </div>
      )}
      {lead && (
        <Typography variant="subtitle1" mt={4}>
          {lead}
        </Typography>
      )}
    </header>
  )
}
