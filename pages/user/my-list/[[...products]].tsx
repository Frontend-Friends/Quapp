import React from 'react'
import { ProductType } from '../../../components/products/types'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../config/session-config'
import { getUser } from '../../../lib/services/get-user'
import { InferGetServerSidePropsType } from 'next'
import { ProductList } from '../../../components/products/product-list'
import { fetchProduct } from '../../../lib/services/fetch-product'
import { fetchMyProductList } from '../../../lib/services/fetch-my-product-list'
import { Header } from '../../../components/header'
import { useTranslation } from '../../../hooks/use-translation'

export const getServerSideProps = withIronSessionSsr<{
  userId?: string
  products?: ProductType[]
  userName?: string
  productDetail: ProductType | null
  space?: string | null
}>(async ({ req, query }) => {
  const { user } = req.session

  if (!user || !user.id) {
    return { notFound: true }
  }

  const { products: productsQuery } = query as {
    products: string[] | undefined
  }

  const [fetchedUser] = await getUser(user.id)

  const productList = await Promise.all(
    fetchedUser.spaces?.map(
      (spaceId) =>
        new Promise<ProductType[]>(async (resolve) => {
          const products = await fetchMyProductList(spaceId, user.id as string)
          resolve(products)
        })
    ) || []
  )

  const filteredList = productList
    .flat()
    .filter((item) => item.owner.id === user.id)
  const foundProduct = filteredList.find(
    (item) => item.id === productsQuery?.[0]
  )

  console.log(productsQuery)
  let productDetail: ProductType | undefined = undefined
  if (productsQuery && foundProduct) {
    productDetail = await fetchProduct(
      foundProduct.spaceId,
      productsQuery[0],
      user.id || ''
    )

    if (!productDetail) {
      return { notFound: true }
    }
  }

  console.log(productDetail?.spaceId)

  return {
    props: {
      userId: user.id,
      userName: user.userName,
      products: filteredList,
      productDetail: productDetail || null,
      space: productDetail?.spaceId || null,
    },
  }
}, sessionOptions)

export const MyList = ({
  products,
  userId,
  userName,
  productDetail,
  space,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslation()
  return (
    <main className="m mx-auto grid w-full max-w-7xl gap-4 p-3">
      <Header title={t('PRODUCTS_my_list')} />
      <ProductList
        products={products}
        productDetail={productDetail}
        userId={userId}
        userName={userName}
        withSpaceName
        space={space}
      />
    </main>
  )
}

export default MyList
