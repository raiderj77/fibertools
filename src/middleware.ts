import { NextRequest, NextResponse } from 'next/server'
import {
  buildAdSenseStrictCsp,
  createCspNonce,
  getStrictCspMode,
} from '@/lib/strict-csp.mjs'

export function middleware(request: NextRequest) {
  const nonceCspMode = getStrictCspMode()
  let response: NextResponse

  if (nonceCspMode === 'report-only') {
    // Always replace client-supplied values. Only this middleware may mint a
    // nonce or tell Next which CSP to use when it nonces framework scripts.
    const nonce = createCspNonce()
    const strictCsp = buildAdSenseStrictCsp(nonce)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    requestHeaders.set('Content-Security-Policy', strictCsp)

    response = NextResponse.next({
      request: { headers: requestHeaders },
    })
    response.headers.set('Content-Security-Policy-Report-Only', strictCsp)
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('x-fibertools-nonce-csp', nonceCspMode)
  } else {
    response = NextResponse.next()
  }

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
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|manifest.json|robots.txt|ads.txt|llms.txt|sitemap.xml|sw.js|offline.html|icon-192x192.png|icon-512x512.png).*)',
    },
  ],
}
