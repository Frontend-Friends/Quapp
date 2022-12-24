import { FC, useState } from 'react'
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
import SpaceForm from './space-form'

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
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <CondensedContainer className="relative">
      <Header title={t('SPACES_title')} />
      {!!spaces?.length ? (
        <Grid container columns={{ md: 1 }} spacing={{ xs: 4 }} pt={4}>
          {spaces.map((space) => (
            <SpaceItem key={space.id} space={space} />
          ))}
        </Grid>
      ) : (
        <Typography variant="body2">{t('SPACES_no_entries')}</Typography>
      )}
      <Fab
        color="primary"
        aria-label="add"
        variant="extended"
        className="mt-8"
        onClick={() => setOpen((state) => !state)}
      >
        <AddIcon className="mr-2" /> {t('SPACES_add_space')}
      </Fab>
      {open && (
        <SpaceForm
          setOpen={setOpen}
          open={open}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMessage={setMessage}
          message={message}
        />
      )}
    </CondensedContainer>
  )
}

export default Dashboard
