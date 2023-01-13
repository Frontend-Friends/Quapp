import React, { useState } from 'react'
import { Button } from '@mui/material'
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
import InvitationModal from './InvitationModal'
import { useSnackbar } from '../../../../hooks/use-snackbar'
import { ProductList } from '../../../../components/products/product-list'

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

  if (!user) {
    return { props: {} }
  }

  const { products: productsQuery, space, skip, filter } = query

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

  const setAlert = useSnackbar((state) => state.setAlert)

  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const handleInvitation = async (values: InvitationType) => {
    setIsLoading(true)
    try {
      const invitation = await sendFormData<{
        isInvitationOk: boolean
        message: string
      }>('/api/invitation', { ...values, space: space })
      setAlert({ severity: 'success', children: invitation.message })
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
      <Button onClick={() => setOpenModal(true)} variant="contained">
        {t('BUTTON_invite_member')}
      </Button>
      <Header title={`${t('PRODUCTS_title')} ${spaceName ? spaceName : ''}`} />

      <ProductList
        products={products}
        productDetail={productDetail}
        userId={userId}
        categories={categories}
        userName={userName}
        count={count}
      />
      <InvitationModal
        setOpenModal={setOpenModal}
        space={space}
        openModal={openModal}
        isLoading={isLoading}
        handleInvitation={handleInvitation}
      />
    </main>
  )
}

export default Product
