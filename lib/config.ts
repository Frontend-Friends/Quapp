import { IronSessionOptions } from 'iron-session'
import { sessionOptions } from '../config/session-config'

export const ironOptions: IronSessionOptions = {
  ...sessionOptions,
}

const dev = process.env.NODE_ENV !== 'production'

//todo set server path in production
export const server = dev
  ? 'http://localhost:3000'
  : 'https://your_deployment.server.com'
