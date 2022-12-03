import { FC } from 'react'
import { CondensedContainer } from '../../components/condensed-container'
import { useTranslation } from '../../hooks/use-translation'
import { Fab, Grid, Typography } from '@mui/material'
import { Header } from '../../components/header'
import AddIcon from '@mui/icons-material/Add'
import { InferGetServerSidePropsType } from 'next'
import { SpaceItemType } from '../../components/products/types'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import SpaceItem from '../../components/spaces/space-item'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'

export const getServerSideProps = withIronSessionSsr<{
  spaces?: SpaceItemType[]
}>(async ({ req }) => {
  const { user } = req.session
  if (!user) {
    return { props: {} }
  }

  const spaces = await Promise.all<SpaceItemType>(
    user.spaces?.map(
      (space) =>
        new Promise(async (resolve) => {
          const ref = doc(db, 'spaces', space)
          const fetchedDoc = await getDoc(ref).then((result) => {
            const data = result.data()
            return {
              ...data,
              id: result.id,
              creatorId: data?.creatorId.id,
              ownerId: data?.ownerId.id,
              creationDate: data?.creationDate.seconds,
            } as SpaceItemType
          })
          resolve(fetchedDoc)
        })
    ) || []
  )

  return { props: { spaces } }
}, sessionOptions)
const Dashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  spaces,
}) => {
  const t = useTranslation()

  return (
    <CondensedContainer sx={{ position: 'relative' }}>
      <Header title={t('SPACES_title')} />
      {spaces && !!spaces.length ? (
        <Grid container columns={{ md: 1 }} spacing={{ xs: 4 }} pt={4}>
          {spaces.map((space) => (
            <SpaceItem key={space.id} space={space} />
          ))}
        </Grid>
      ) : (
        <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
      )}

      <Fab color="primary" aria-label="add" variant="extended" sx={{ mt: 4 }}>
        <AddIcon sx={{ mr: 1 }} /> {t('SPACES_add_space')}
      </Fab>
    </CondensedContainer>
  )
}

export default Dashboard
