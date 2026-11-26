
const COOKIE_NAME = 'christmas_session'
const SESSION_DURATION = 60 * 60 * 24

const encoder = new TextEncoder()

// Normalize first name
export function normalizeName(name) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
}

// Normalize US phone number
export function normalizePhone(phone) {
  let digits = String(phone ?? '').replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1)
  }

  return digits
}

// Generate JSON response
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

// Generate cryptographic signing key
async function getSigningKey(secret) {
  if (!secret || secret.length < 32) {
    throw new Error('Invalid SESSION_SECRET')
  }

  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign', 'verify']
  )
}

// Create authenticated session
export async function createSession(secret) {
  const expires =
    Math.floor(Date.now() / 1000) + SESSION_DURATION

  const payload = `${expires}.${crypto.randomUUID()}`

  const key = await getSigningKey(secret)

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  )

  const signatureHex = Array.from(
    new Uint8Array(signature),
    byte => byte.toString(16).padStart(2, '0')
  ).join('')

  return `${payload}.${signatureHex}`
}

// Verify authenticated session
export async function verifySession(request, secret) {
  try {
    const cookies = request.headers.get('Cookie') || ''

    const cookie = cookies
      .split(';')
      .map(value => value.trim())
      .find(value =>
        value.startsWith(`${COOKIE_NAME}=`)
      )

    if (!cookie) return false

    const token = cookie.slice(COOKIE_NAME.length + 1)
    const parts = token.split('.')

    if (parts.length !== 3) return false

    const [expires, nonce, signature] = parts

    if (
      !/^\d+$/.test(expires) ||
      Number(expires) <= Date.now() / 1000 ||
      !/^[a-f0-9]{64}$/.test(signature)
    ) {
      return false
    }

    const key = await getSigningKey(secret)

    const signatureBytes = Uint8Array.from(
      signature.match(/.{2}/g),
      value => parseInt(value, 16)
    )

    return await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(`${expires}.${nonce}`)
    )

  } catch {
    return false
  }
}

// Generate session cookie
export function sessionCookie(token, request) {
  const secure =
    new URL(request.url).protocol === 'https:'
      ? '; Secure'
      : ''

  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION}${secure}`
}

// Remove session cookie
export function clearSessionCookie(request) {
  const secure =
    new URL(request.url).protocol === 'https:'
      ? '; Secure'
      : ''

  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
}
