
import {
  verifySession,
  json,
} from '../../server/auth.js'

export async function onRequestGet({ request, env }) {
  const authenticated = await verifySession(
    request,
    env.SESSION_SECRET
  )

  if (!authenticated) {
    return json({
      authenticated: false,
    })
  }

  return json({
    authenticated: true,
    firstName: env.ALLOWED_FIRST_NAME,
  })
}
