import { Dispatch, FC, SetStateAction, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Typography,
} from '@mui/material'
import { useTranslation } from '../../../hooks/use-translation'
import { GetServerSideProps } from 'next'
import { PRODUCTS_MOCK } from '../../../mock/products-mock'
import { ProductItem } from '../../../components/products/product-item'
import { Header } from '../../../components/header'
import { AuthContainer } from '../../../components/auth-container'

export type Products = {
  id: string
  title: string
  description?: string
  imgSrc?: string
  isAvailable: boolean
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      products: PRODUCTS_MOCK as Products[],
    },
  }
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

export type DetailProduct = {
  title: string
  subtitle: string
  imgSrc: string
}

export const ProductDetail = ({
  product,
  isOpen,
  toggleModal,
}: {
  product: DetailProduct
  isOpen: boolean
  toggleModal: () => void
}) => {
  const t = useTranslation()
  return (
    <Modal
      open={isOpen}
      onClose={toggleModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <AuthContainer>
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
      </AuthContainer>
    </Modal>
  )
}

export const Product: FC<{ products: Products[] }> = ({ products }) => {
  const t = useTranslation()

  const [modalState, setModalState] = useState(false)

  return (
    <>
      <Header title={t('PRODUCTS_title')} />
      <Grid container columns={{ sm: 2, md: 3 }} spacing={{ xs: 4 }} pt={4}>
        {!products.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!products.length &&
          products.map((product) => (
            <Grid item xs={1} key={product.id} sx={{ flexGrow: '1' }}>
              <ProductItem
                product={product}
                handleMoreInformation={() => {
                  setModalState(true)
                }}
              />
            </Grid>
          ))}
      </Grid>
      <ProductDetail
        product={{
          title: 'Product 1',
          imgSrc: 'https://source.unsplash.com/random',
          subtitle:
            'Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans. Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen. Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik. Der große Oxmox riet ihr davon ab, da es dort wimmele v',
        }}
        isOpen={modalState}
        toggleModal={() => {
          setModalState(false)
        }}
      />
    </>
  )
}

export default Product
