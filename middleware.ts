import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { sessionOptions } from './config/session-config'

export const config = {
  matcher: ['/community/:path*'],
}

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, sessionOptions)
  const { user } = session
  if (!user) {
    if (req.nextUrl.pathname !== '/auth/login') {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  return res
}
