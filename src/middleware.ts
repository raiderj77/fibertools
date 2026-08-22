import { NextRequest, NextResponse } from 'next/server'
import { isEmbedPath } from '@/lib/embed-policy.mjs'

export function middleware(request: NextRequest) {
  if (isEmbedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const gpc = request.headers.get('sec-gpc') === '1'
  if (gpc) {
    // The consent component reads this bridge cookie when the browser exposes
    // Sec-GPC without exposing navigator.globalPrivacyControl to client code.
    // httpOnly: false is intentional, the consent banner JS must read this value.
    response.cookies.set('empire_gpc', '1', {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    })
  } else if (request.cookies.has('empire_gpc')) {
    // Keep the bridge aligned with the current request instead of leaving a
    // stale opt-out cookie after the browser's GPC signal is turned off.
    response.cookies.delete('empire_gpc')
  }
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
