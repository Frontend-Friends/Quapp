import { NextApiRequest, NextApiResponse } from 'next'
import { arrayRemove, deleteDoc, updateDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { getSpace } from '../../lib/services/get-space'
import { getUserRef } from '../../lib/helpers/refs/get-user-ref'

async function deleteSpace(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spaceId } = req.query
    const { user } = req.session
    if (!user) {
      sendError(res)
      return
    }

    const [space, spaceRef] = await getSpace(spaceId as string)

    await Promise.all(
      space?.users?.map(
        (id) =>
          new Promise(async (resolve) => {
            const [userRef] = getUserRef(id)
            await updateDoc(userRef, {
              spaces: arrayRemove(space.id),
            })
            resolve(true)
          })
      ) || []
    )

    await deleteDoc(spaceRef)

    sendResponse(res, { message: 'The space is successfully deleted' })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(deleteSpace, sessionOptions)
