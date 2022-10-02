import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Modal,
  Typography,
} from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import Link from 'next/link'
import CloseIcon from '@mui/icons-material/Close'
import { Header } from '../header'
import { ProductType } from '../../pages/space/products/[[...products]]'

export const ProductDetail = ({
  product,
  isOpen,
  toggleModal,
}: {
  product?: ProductType
  isOpen: boolean
  toggleModal: () => void
}) => {
  const { asPath, query, push } = useRouter()

  const backUrl = useMemo(() => {
    const queryString = (query.products as string[])?.join('/')

    return queryString ? asPath.replace(`/${queryString}`, '') : asPath
  }, [asPath, query])

  const t = useTranslation()
  return product ? (
    <Modal
      open={isOpen}
      onClose={() => {
        push(backUrl, undefined, { shallow: true })
      }}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      disablePortal
    >
      <CondensedContainer
        sx={{
          position: 'relative',
          backgroundColor: 'white',
          p: 4,
          m: 0,
          maxHeight: '100%',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            height: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Link href={backUrl} passHref shallow>
            <IconButton
              onClick={toggleModal}
              sx={{
                marginTop: -3,
                marginRight: -1,
                width: '48px',
                height: '48px',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Link>
        </Box>
        <Header
          title={product.title}
          lead={product.lead}
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
        <Typography variant="body1" sx={{ mb: 4 }}>
          {product.text}
        </Typography>
        <Card>
          <CardContent>
            <Button variant="contained">{t('BUTTON_borrow')}</Button>
          </CardContent>
        </Card>
      </CondensedContainer>
    </Modal>
  ) : null
}
