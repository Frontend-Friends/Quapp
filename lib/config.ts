import { IronSessionOptions } from 'iron-session'
import { sessionOptions } from '../config/session-config'

export const ironOptions: IronSessionOptions = {
  ...sessionOptions,
}
