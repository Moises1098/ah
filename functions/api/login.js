
import {
  normalizeName,
  normalizePhone,
  createSession,
  sessionCookie,
  json,
} from '../../server/auth.js'

export async function onRequestPost({ request, env }) {
  try {
    // Prevent cross-origin login requests
    if (
      request.headers.get('Origin') !==
      new URL(request.url).origin
    ) {
      return json({ error: 'Forbidden' }, 403)
    }

    const { firstName, phoneNumber } = await request.json()

    const allowedName = normalizeName(env.ALLOWED_FIRST_NAME)
    const allowedPhone = normalizePhone(env.ALLOWED_PHONE_NUMBER)

    // Verify server configuration
    if (!allowedName || allowedPhone.length !== 10 || !env.SESSION_SECRET) {
      return json({ error: 'Login is not configured.' }, 500)
    }

    // Validate credentials
    if (
      normalizeName(firstName) !== allowedName ||
      normalizePhone(phoneNumber) !== allowedPhone
    ) {
      return json({
        error: 'Incorrect first name or phone number.',
      }, 401)
    }

    // Create session
    const token = await createSession(env.SESSION_SECRET)

    return json(
      {
        authenticated: true,
        firstName: env.ALLOWED_FIRST_NAME,
      },
      200,
      {
        'Set-Cookie': sessionCookie(token, request),
      }
    )

  } catch {
    return json({
      error: 'Unable to log in. Please try again.',
    }, 500)
  }
}
