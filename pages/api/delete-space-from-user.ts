import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { getUser } from '../../lib/services/get-user'
import { arrayRemove, updateDoc } from 'firebase/firestore'

async function deleteSpaceFromUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spaceId } = req.query
    const { user } = req.session
    if (!user) {
      sendError(res)
      return
    }

    const [, userRef] = await getUser(user.id as string)

    await updateDoc(userRef, {
      spaces: arrayRemove(spaceId),
    })

    sendResponse(res, { spaceId })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(deleteSpaceFromUser, sessionOptions)
