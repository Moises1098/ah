
import {
  clearSessionCookie,
  json,
} from '../../server/auth.js'

export async function onRequestPost({ request }) {
  // Prevent cross-origin logout requests
  if (
    request.headers.get('Origin') !==
    new URL(request.url).origin
  ) {
    return json({ error: 'Forbidden' }, 403)
  }

  return json(
    {
      success: true,
      authenticated: false,
    },
    200,
    {
      'Set-Cookie': clearSessionCookie(request),
    }
  )
}
