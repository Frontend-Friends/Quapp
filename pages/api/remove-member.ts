import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../config/session-config'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'
import { removeMember } from '../../lib/helpers/remove-member'

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { space, userId } = req.query as { space: string; userId: string }

      await removeMember({ space, userId })

      sendResponse(res)
    } catch (err) {
      console.log(err)
      sendError(res)
    }
  },
  sessionOptions
)
