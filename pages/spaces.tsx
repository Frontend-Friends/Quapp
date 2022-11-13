import { FC } from 'react'
import { CondensedContainer } from '../components/condensed-container'
import { useTranslation } from '../hooks/use-translation'
import { Grid, Typography } from '@mui/material'
import { Header } from '../components/header'
import { InferGetServerSidePropsType } from 'next'
import { SpaceItemType } from '../components/products/types'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import SpaceItem from '../components/spaces/space-item'

export const getServerSideProps = async () => {
  const spaceCollection = collection(db, 'spaces')
  const spaceSnapshot = await getDocs(spaceCollection)
  const spaces: SpaceItemType[] = []
  spaceSnapshot.forEach((spaceData) => {
    const data = spaceData.data()
    spaces.push({
      ...data,
      id: spaceData.id,
      creatorId: data.creatorId.id,
      ownerId: data.ownerId.id,
      creationDate: data.creationDate.seconds,
    } as SpaceItemType)
  })
  return { props: { spaces } }
}

const Spaces: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  spaces,
}) => {
  const t = useTranslation()

  return (
    <CondensedContainer>
      <Header title={t('SPACES_title')} />
      <Grid container columns={{ sm: 2, md: 3 }} spacing={{ xs: 4 }} pt={4}>
        {spaces.length ? (
          spaces.map((space) => <SpaceItem key={space.id} space={space} />)
        ) : (
          <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
        )}
      </Grid>
    </CondensedContainer>
  )
}

export default Spaces
