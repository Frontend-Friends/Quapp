import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { ironOptions } from './lib/config'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
}

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, {
    ...ironOptions,
  })
  const { user } = session

  // like mutate user:
  // user.something = someOtherThing;
  // or:
  // session.user = someoneElse;

  // uncomment next line to commit changes:
  // await session.save();
  // or maybe you want to destroy session:
  // await session.destroy();
  //todo @LK, if certain routes (i.e. spaces and dashboard) than check if user otherwise redirect to login
  if (!req.nextUrl.pathname.startsWith('/login') && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return res
}
