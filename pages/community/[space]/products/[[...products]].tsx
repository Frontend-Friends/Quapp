import React, { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { useTranslation } from '../../../../hooks/use-translation'
import { InferGetServerSidePropsType } from 'next'
import { Header } from '../../../../components/header'
import {
  InvitationType,
  ProductType,
  SpaceItemType,
} from '../../../../components/products/types'
import { fetchProduct } from '../../../../lib/services/fetch-product'
import { fetchProductList } from '../../../../lib/services/fetch-product-list'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../../config/session-config'
import { useRouter } from 'next/router'
import { User } from '../../../../components/user/types'
import { getQueryAsNumber } from '../../../../lib/helpers/get-query-as-number'
import { getDoc } from 'firebase/firestore'
import { getSpaceRef } from '../../../../lib/helpers/refs/get-space-ref'

import { sendFormData } from '../../../../lib/helpers/send-form-data'
import { useSnackbar } from '../../../../hooks/use-snackbar'
import { ProductList } from '../../../../components/products/product-list'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { getUser } from '../../../../lib/services/get-user'
import { InvitationModal } from '../../../../components/invitation-modal'

export const maxProductsPerPage = 20

export const getServerSideProps = withIronSessionSsr<{
  userId?: User['id']
  userName?: User['userName']
  products?: ProductType[]
  productDetail?: ProductType | null
  count?: number
  spaceName?: string
  categories?: string[]
}>(async ({ query, req }) => {
  const { user } = req.session
  const { products: productsQuery, space, skip, filter } = query

  if (!user) {
    return { props: {} }
  }

  const [fetchedUser] = await getUser(user.id || '')

  if (!fetchedUser.spaces || !fetchedUser.spaces.includes(space as string)) {
    return { notFound: true }
  }

  const { products, count } = await fetchProductList(
    (space as string) || '',
    getQueryAsNumber(skip),
    filter === undefined ? undefined : getQueryAsNumber(filter)
  )

  let productDetail: ProductType | undefined = undefined
  if (productsQuery) {
    productDetail = await fetchProduct(
      (space as string) || '',
      productsQuery[0],
      user.id || ''
    )

    if (!productDetail) {
      return { notFound: true }
    }
  }

  const [spaceRef] = getSpaceRef(space as string)
  const fetchedSpace = await getDoc(spaceRef).then(
    (result) => result.data() as SpaceItemType
  )

  const spaceData = await getDoc(spaceRef).then((r) => r.data())

  return {
    props: {
      userId: user.id || null,
      userName: user.userName || '',
      products,
      count,
      productDetail: productDetail || null,
      categories: spaceData?.categories || [],
      spaceName: fetchedSpace?.name ?? '',
    },
  }
}, sessionOptions)

export const Product = ({
  userName,
  userId,
  products,
  count,
  spaceName,
  productDetail,
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslation()
  const { query } = useRouter()

  const { space } = query as {
    space: string
    skip?: string
    filter?: string
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const setAlert = useSnackbar((state) => state.setAlert)

  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const handleInvitation = async (values: InvitationType) => {
    setIsLoading(true)
    try {
      const invitation = await sendFormData<{
        isInvitationOk: boolean
        message: string
        ok: boolean
      }>('/api/invitation', { ...values, space: space })
      if (invitation.ok) {
        setAlert({ severity: 'success', children: invitation.message })
      } else {
        setAlert({ severity: 'error', children: invitation.message })
      }
      setOpenModal(false)
      setIsLoading(false)
    } catch {
      setAlert({ severity: 'error', children: t('INVITATION_server_error') })
      setOpenModal(true)
      setIsLoading(false)
    }
  }

  return (
    <main className="m mx-auto grid w-full max-w-7xl gap-4 p-3">
      <Box className="flex">
        <Header title={spaceName ? spaceName : ''} />
        <IconButton
          aria-label="settings"
          aria-controls={open ? 'products-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className="relative ml-auto"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Menu
        id="products-menu"
        anchorEl={anchorEl}
        open={open}
        disableScrollLock={true}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenModal(true)
            handleClose()
          }}
        >
          {t('BUTTON_invite_member')}
        </MenuItem>
      </Menu>

      <ProductList
        products={products}
        productDetail={productDetail}
        userId={userId}
        categories={categories}
        userName={userName}
        count={count}
        space={space}
      />
      <InvitationModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        isLoading={isLoading}
        handleInvitation={handleInvitation}
      />
    </main>
  )
}

export default Product
