import { SpaceItemType } from '../../components/products/types'
import { getDoc } from 'firebase/firestore'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { getSpaceRef } from '../../lib/helpers/refs/get-space-ref'
import { fetchUser } from '../../lib/services/fetch-user'
import { Dashboard } from '../../components/pages/dashboard'
import { useTranslation } from '../../hooks/use-translation'

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
          const fetchedDoc = await getDoc(ref).then((result) => {
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
  return { props: { spaces } }
}, sessionOptions)

export const Index = ({ spaces }: { spaces?: SpaceItemType[] }) => {
  const t = useTranslation()
  return <Dashboard t={t} spaces={spaces} />
}

export default Index
