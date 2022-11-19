import 'iron-session'
import { User } from './components/user/types'

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}
