import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { sessionOptions } from './config/session-config'

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, sessionOptions)

  const { user } = session
  if (
    (req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname === '/') &&
    user
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return res
}
