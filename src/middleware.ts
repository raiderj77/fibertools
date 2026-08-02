import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const gpc = request.headers.get('sec-gpc') === '1'
  if (gpc) {
    // empire_gpc is readable by the client-side privacy controller so the
    // server-observed signal wins before optional Google scripts can load.
    // httpOnly: false is intentional, the consent banner JS must read this value.
    response.cookies.set('empire_gpc', '1', {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    })
  } else if (request.cookies.has('empire_gpc')) {
    // Do not leave a stale opt-out cookie after the browser stops sending GPC.
    response.cookies.delete('empire_gpc')
  }
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
