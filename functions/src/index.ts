import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

export const fetchProduct = async (
  space: string,
  productsQuery: string
  // userId?: string
) => {
  const product = await admin
    .firestore()
    .doc(`spaces/${space}/products/${productsQuery}`)
    .get()
    .then((r) => ({
      id: r.id,
      ...r.data(),
    }))

  return {
    product,
  }
}

export const getProduct = functions.https.onRequest(
  async (request, response) => {
    const { space, productsQuery, userId } = request.query as {
      space: string
      productsQuery: string
      userId?: string
    }
    const product = await fetchProduct(space, productsQuery, userId)
    response
      .header('content-type', 'application/json')
      .json({ product: product || null })
  }
)
