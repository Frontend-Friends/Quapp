import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { Header } from '../../../components/header/header'
import { Avatar, Box, Button, Card, CardContent } from '@mui/material'
import { useTranslation } from '../../../hooks/use-translation'

export type DetailProduct = {
  title: string
  subtitle: string
  imgSrc: string
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      product: {
        title: 'Product 1',
        imgSrc: 'https://source.unsplash.com/random',
        subtitle:
          'Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans. Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen. Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik. Der große Oxmox riet ihr davon ab, da es dort wimmele v',
      },
    },
  }
}

export const Id: FC<{ product: DetailProduct }> = ({ product }) => {
  const t = useTranslation()
  return (
    <>
      <Header
        title={product.title}
        lead={product.subtitle}
        imgSrc={product.imgSrc}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
        <Avatar
          alt="Remy Sharp"
          src="https://source.unsplash.com/random"
          sx={{ width: 56, height: 56 }}
        >
          RS
        </Avatar>
        <p>Remy Sharp</p>
      </Box>
      <Card>
        <CardContent>
          <Button variant="contained">{t('BUTTON_borrow')}</Button>
        </CardContent>
      </Card>
    </>
  )
}

export default Id
