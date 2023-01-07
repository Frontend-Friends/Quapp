import { NextApiRequest, NextApiResponse } from 'next'
import { deleteDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { getSpace } from '../../lib/services/get-space'

async function deleteSpace(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spaceId } = req.query
    const { user } = req.session
    if (!user) {
      sendError(res)
      return
    }

    const [, spaceRef] = await getSpace(spaceId as string)

    await deleteDoc(spaceRef)

    sendResponse(res, { spaceId })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(deleteSpace, sessionOptions)
