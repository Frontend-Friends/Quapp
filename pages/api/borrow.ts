import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const value = req.body

  const parsedValue = { ...JSON.parse(value), status: 'pending' }

  res.status(200).json(parsedValue)
}
