import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { useTranslation } from '../../hooks/use-translation'
import { SpaceItemType } from '../products/types'

interface Props {
  space: SpaceItemType
}

const SpaceItem: FC<Props> = ({ space }) => {
  const t = useTranslation()
  return (
    <Grid item xs={1} sx={{ flexGrow: '1' }}>
      <Card variant="outlined">
        <CardHeader title={space.name} />
        <CardContent>
          {space.memberCount && (
            <Typography variant="body2">
              {t('SPACES_members')}: {space.memberCount}
            </Typography>
          )}
          {space.itemCount && (
            <Typography variant="body2">
              {t('SPACES_items')}: {space.itemCount}
            </Typography>
          )}
        </CardContent>
        <CardActions>Settings</CardActions>
      </Card>
    </Grid>
  )
}

export default SpaceItem
