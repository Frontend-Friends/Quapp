import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'

async function cookie(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req.session
    if (user) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.status(200).json({
        isUser: true,
      })
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.send({
        isUser: false,
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({
      isUser: false,
      message: 'An error occurred when trying checking for cookie',
    })
  }
}

export default withIronSessionApiRoute(cookie, sessionOptions)
