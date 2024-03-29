import { NextApiResponse } from 'next'

export const sendError = <T extends object>(
  res: NextApiResponse,
  value?: T
) => {
  res
    .status(500)
    .json({ ok: false, errorMessage: 'RESPONSE_SERVER_ERROR', ...value })
}
