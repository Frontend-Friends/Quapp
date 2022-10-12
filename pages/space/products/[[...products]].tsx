import { FC, useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import { useTranslation } from '../../../hooks/use-translation'
import { GetServerSideProps } from 'next'
import { ProductItem } from '../../../components/products/product-item'
import { Header } from '../../../components/header'
import { useRouter } from 'next/router'
import { ProductDetail } from '../../../components/products/product-detail'
import {
  ProductChatType,
  ProductType,
} from '../../../components/products/types'
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '../../../config/firebase'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const productCollection = collection(db, 'products')
  const { products: productsQuery } = query

  const productSnapshot = await getDocs(productCollection)

  const productsData: DocumentData[] = []

  productSnapshot.forEach((productDoc) => {
    const docData = productDoc.data()
    productsData.push({
      ...docData,
      owner: docData.owner.id,
      id: productDoc.id,
    })
  })

  /*const products = await Promise.all(
    productsData.map(async (productData) => {
      const chatCollection = collection(db, 'products', productData.id, 'chat')
      const [owner, chatSnapshot] = await Promise.all([
        getDoc(productData.owner).then<{ id: string; userName: string }>(
          (r) => ({
            userName: (r.data() as { userName: string }).userName,
            id: r.id,
          })
        ),
        getDocs(chatCollection),
      ])
      const chatData: DocumentData[] = []
      chatSnapshot.forEach((chatItem) => {
        chatData.push({
          chat: chatItem.data(),
          chatUserId: chatItem.id,
        })
      })

      const chats = await Promise.all(
        chatData.map(async ({ chat, chatUserId }) => {
          const ref = doc(db, 'user', chatUserId)
          const user = await getDoc(ref).then((r) => r.data())
          return {
            chatUserName: user?.userName || null,
            chatUserId,
            history: chat.history || [],
          } as ProductChatType
        })
      )

      return {
        ...productData,
        owner: { userName: owner.userName, id: owner.id },
        chats,
      }
    })
  )*/

  return {
    props: {
      products: productsData,
    },
  }
}

export const Product: FC<{ products: ProductType[] }> = ({ products }) => {
  const t = useTranslation()

  const { query } = useRouter()

  const product = useMemo(() => {
    return products.find((item) => item.id === query.products?.[0])
  }, [products, query])

  return (
    <>
      <Header title={t('PRODUCTS_title')} />
      <Grid container columns={{ sm: 2, md: 3 }} spacing={{ xs: 4 }} pt={4}>
        {!products.length && (
          <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
        )}
        {!!products.length &&
          products.map((item, index) => (
            <Grid item xs={1} key={index} sx={{ flexGrow: '1' }}>
              <ProductItem product={item} />
            </Grid>
          ))}
      </Grid>
      <ProductDetail product={product} />
    </>
  )
}

export default Product
