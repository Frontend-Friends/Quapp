import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../config/session-config'
import { mockUsers } from '../../mock/mock-users'

export default withIronSessionApiRoute(async (req, res) => {
  const [fabriceTobler] = await mockUsers()
  req.session.user = { ...fabriceTobler }
  await req.session.save()
  res.json(fabriceTobler)
}, sessionOptions)
