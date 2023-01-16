import { NextApiRequest, NextApiResponse } from 'next'
import { arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { getSpace } from '../../lib/services/get-space'
import { fetchUser } from '../../lib/services/fetch-user'
import { db } from '../../config/firebase'

async function deleteSpace(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spaceId } = req.query
    const { user } = req.session
    if (!user) {
      sendError(res)
      return
    }

    const [space, spaceRef] = await getSpace(spaceId as string)

    space?.users?.map(async (id) => {
      const fetchedUser = await fetchUser(id)
      const userRef = doc(db, 'user', id ?? '')

      const spaceIndex: number =
        fetchedUser.spaces?.findIndex((item) => item === space.id) ?? -1
      if (spaceIndex !== -1) {
        const newSpaces = fetchedUser?.spaces?.splice(spaceIndex, 1)
        await updateDoc(userRef, {
          spaces: arrayUnion(newSpaces),
        })
      }
    })

    await deleteDoc(spaceRef)

    sendResponse(res, { message: 'The space is successfully deleted' })
  } catch (err) {
    console.error(err)
    sendError(res)
  }
}

export default withIronSessionApiRoute(deleteSpace, sessionOptions)
