import {
  SpaceItemType,
  SpaceItemTypeWithUser,
} from '../../components/products/types'
import { getDoc } from 'firebase/firestore'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { getSpaceRef } from '../../lib/helpers/refs/get-space-ref'
import { fetchUser } from '../../lib/services/fetch-user'
import { Dashboard } from '../../components/pages/dashboard'
import { useTranslation } from '../../hooks/use-translation'
import { User } from '../../components/user/types'

export const getServerSideProps = withIronSessionSsr<{
  spaces?: SpaceItemType[]
}>(async ({ req }) => {
  const { user } = req.session
  if (!user) {
    return { props: {} }
  }
  const fetchedUser = await fetchUser(user.id ?? '')
  const spaces = await Promise.all<SpaceItemType>(
    fetchedUser.spaces?.map(
      (space) =>
        new Promise(async (resolve) => {
          const [ref] = getSpaceRef(space)
          const fetchedDoc = await getDoc(ref).then(async (result) => {
            const data = result.data()

            return {
              ...data,
              id: result.id,
              ownerId: data?.ownerId.id || '',
              creatorId: data?.creatorId.id || '',
              creationDate: data?.creationDate?.seconds ?? 0,
            } as SpaceItemType
          })
          resolve(fetchedDoc)
        })
    ) || []
  )
  const spacesWithUsers = (await Promise.all(
    spaces.map(
      (space) =>
        new Promise(async (resolveSpace) => {
          const users = await Promise.all<{ id: string; userName: string }>(
            space?.users?.map(
              (u) =>
                new Promise(async (resolveUser) => {
                  const spaceUser = await fetchUser(u)
                  resolveUser({
                    id: spaceUser.id ?? '',
                    userName: spaceUser.userName ?? '',
                  })
                }) || []
            ) || []
          )
          resolveSpace({ ...space, users })
        })
    )
  )) as SpaceItemTypeWithUser[]
  return { props: { spaces: spacesWithUsers, user: user } }
}, sessionOptions)

export const Index = ({
  spaces,
  user,
}: {
  spaces?: SpaceItemTypeWithUser[]
  user: User
}) => {
  const t = useTranslation()
  console.log('user is', user)
  console.log('spaces are', spaces)

  return <Dashboard t={t} spaces={spaces} user={user} />
}

export default Index
