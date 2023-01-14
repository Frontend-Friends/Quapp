import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { sendResponse } from '../../lib/helpers/send-response'
import { sendError } from '../../lib/helpers/send-error'
import { parsedForm } from '../../lib/helpers/parsed-form'
import { fetchSpace } from '../../lib/services/fetch-space'
import { setDoc } from 'firebase/firestore'
import { getSpaceRef } from '../../lib/helpers/refs/get-space-ref'
import { SpaceItemType } from '../../components/products/types'

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}

async function editSpace(req: NextApiRequest, res: NextApiResponse) {
  const { fields } = await parsedForm<{
    fields: {
      name: string
      ownerId: string
      spaceId: string
      updatedSpace: SpaceItemType
    }
  }>(req)
  const { ownerId, spaceId } = fields
  try {
    const [docRef] = getSpaceRef(spaceId)
    const fetchedSpace = await fetchSpace(spaceId)
    const updatedFields = {
      ...fetchedSpace,
      ...fields,
      ownerId: `/space/${ownerId}`,
    }
    await setDoc(docRef, {
      ...updatedFields,
    })
    sendResponse(res, {
      message: 'space edited successfully!',
      updatedSpace: updatedFields,
    })
  } catch {
    sendError(res, { message: 'error editing space' })
  }
}

export default withIronSessionApiRoute(editSpace, sessionOptions)
