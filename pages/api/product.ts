import { NextApiRequest, NextApiResponse } from 'next'
import { fetchProduct } from '../../lib/services/fetch-product'

export default async function productApiHandle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query
  try {
    const product = await fetchProduct(productId as string)

    res.status(200).json(product || null)
  } catch (err) {
    res.status(500).json(err)
  }
}
