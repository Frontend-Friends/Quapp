import * as functions from 'firebase-functions'
import { product as getProduct } from './get-product'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

export const product = functions.https.onRequest(async (request, response) => {
  const { space, productId, userId } = request.query as {
    space: string
    productId: string
    userId?: string
  }
  console.log(request.query)
  try {
    const productDetail = await getProduct(space, productId, userId)
    response
      .header('content-type', 'application/json')
      .json({ product: productDetail || null })
  } catch (error) {
    console.error(error)
    response.header('content-type', 'application/json').json({ product: null })
  }
})
