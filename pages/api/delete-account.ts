import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendError } from '../../lib/helpers/send-error'
import { sendResponse } from '../../lib/helpers/send-response'
import { deleteUser, getAuth } from 'firebase/auth'
import { deleteUserFromFirestore } from '../../lib/helpers/delete-user-from-firestore'
import { assignNewOwner } from '../../lib/helpers/assign-new-owner'
import { fetchUser } from '../../lib/services/fetch-user'
import { removeMember } from '../../lib/helpers/remove-member'

async function deleteAccount(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user: sessionUser } = req.session
    if (!sessionUser) {
      sendError(res)
      return
    }
    const auth = getAuth()
    const authUser = auth.currentUser
    if (!authUser) {
      sendError(res)
      return
    }
    // since session has not necessarily been updated regarding user.spaces yet
    const user = await fetchUser((sessionUser.id as string) || '')
    await deleteUser(authUser).then(async () => {
      await Promise.all(
        user.spaces?.map((space) => {
          new Promise(async (resolve) => {
            await assignNewOwner(space, sessionUser?.id ?? '')
            await removeMember({ space, userId: user.id ?? '' })
            resolve(true)
          })
        }) ?? []
      )
    })
    await deleteUserFromFirestore({ userId: sessionUser.id ?? '' })
    await req.session.destroy()

    await sendResponse(res, {
      message: 'Your account is successfully deleted',
    })
  } catch (err) {
    sendError(res, {
      message: 'RESPONSE_SERVER_ERROR',
    })
  }
}

export default withIronSessionApiRoute(deleteAccount, sessionOptions)
