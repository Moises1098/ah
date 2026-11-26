
import {
  verifySession,
  json,
} from '../server/auth.js'

export async function onRequest(context) {
  const { request, env } = context
  const { pathname } = new URL(request.url)

  // Protect collection images
  if (pathname.startsWith('/images/')) {
    const authenticated = await verifySession(
      request,
      env.SESSION_SECRET
    )

    if (!authenticated) {
      return json({
        error: 'Authentication required.',
      }, 401)
    }

    const response = await context.next()

    const protectedResponse = new Response(
      response.body,
      response
    )

    protectedResponse.headers.set(
      'Cache-Control',
      'private, no-store'
    )

    return protectedResponse
  }

  return context.next()
}
