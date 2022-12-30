import { NextApiResponse } from 'next'

export const sendResponse = <T extends object>(
  res: NextApiResponse,
  payload?: T
) => {
  res.status(200).json({ ok: true, ...payload })
}
