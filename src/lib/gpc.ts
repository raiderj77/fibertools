// Global Privacy Control detection and honoring.
// Server-side detection is used in middleware to set the empire_gpc cookie.
// Client-side detection honors both the browser property and that readable cookie.

export { detectGPCClient, hasGPCConsentCookie } from './gpc-client.mjs'

export function detectGPCServer(request: Request): boolean {
  const header = request.headers.get('sec-gpc')
  return header === '1'
}

export function getConsentDefaultsFromGPC(gpcActive: boolean) {
  if (gpcActive) {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
    }
  }
  return null
}
