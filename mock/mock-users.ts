import { User } from '../components/user/types'
import { fetchUser } from '../lib/services/fetch-user'

const mockFabriceToblerId = 'jk1r8SXpX7mbCgy9WyCy'
const mockLaurentKerbageId = 'REMNKUhwipVJmEStx84c'

export const mockUsers = async () =>
  Promise.all<User>([
    fetchUser(mockFabriceToblerId),
    fetchUser(mockLaurentKerbageId),
  ])
