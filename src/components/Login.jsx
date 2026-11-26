
import { useState } from 'react'
import { motion } from 'motion/react'

import {
  Gift,
  Sparkles,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
} from 'lucide-react'

export default function Login({ onLogin }) {
  const [firstName, setFirstName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Automatically format the phone number
  function formatPhone(value) {
    let digits = value.replace(/\D/g, '')

    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.slice(1)
    }

    digits = digits.slice(0, 10)

    if (digits.length <= 3) {
      return digits
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const canSubmit =
    firstName.trim().length > 0 &&
    phoneNumber.replace(/\D/g, '').length === 10 &&
    !loading

  // Authenticate through Cloudflare
  async function handleSubmit(event) {
    event.preventDefault()

    if (!canSubmit) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'same-origin',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          firstName: firstName.trim(),
          phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.authenticated) {
        throw new Error(
          data.error || 'Unable to log in.'
        )
      }

      onLogin(data.firstName)

    } catch (error) {
      setError(
        error.message || 'Something went wrong. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center overflow-hidden bg-ivory px-8 py-12">

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Sparkles
          size={28}
          strokeWidth={1}
          className="absolute left-8 top-16 text-gold/40"
        />

        <Sparkles
          size={20}
          strokeWidth={1}
          className="absolute right-10 top-32 text-gold/40"
        />

        <Sparkles
          size={26}
          strokeWidth={1}
          className="absolute bottom-24 right-8 text-gold/30"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >

        {/* Christmas emblem */}
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-gold/10">

          <Gift
            size={36}
            strokeWidth={1.2}
            className="text-burgundy"
          />

        </div>

        {/* Header */}
        <header className="mb-9 text-center">

          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-gold-dark">
            Christmas 2026
          </p>

          <h1 className="font-serif text-5xl font-medium leading-none text-burgundy">
            A Little
            <span className="mt-2 block italic">
              Christmas Magic
            </span>
          </h1>

          <div className="mx-auto my-5 h-px w-16 bg-gold" />

          <p className="mx-auto max-w-[270px] text-sm leading-relaxed text-muted">
            Something special has been prepared just for you.
            Unwrap your personal Christmas collection.
          </p>

        </header>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* First name */}
          <div>

            <label
              htmlFor="first-name"
              className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-burgundy"
            >
              First name
            </label>

            <input
              id="first-name"
              type="text"
              autoComplete="given-name"
              autoCapitalize="words"
              placeholder="Your first name"
              value={firstName}
              disabled={loading}
              required
              onChange={event => {
                setFirstName(event.target.value)
                setError('')
              }}
              className="h-14 w-full rounded-xl border border-champagne bg-white px-4 text-base text-espresso outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
            />

          </div>

          {/* Phone number */}
          <div>

            <label
              htmlFor="phone-number"
              className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-burgundy"
            >
              Phone number
            </label>

            <input
              id="phone-number"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(000) 000-0000"
              value={phoneNumber}
              disabled={loading}
              required
              onChange={event => {
                setPhoneNumber(
                  formatPhone(event.target.value)
                )
                setError('')
              }}
              className="h-14 w-full rounded-xl border border-champagne bg-white px-4 text-base text-espresso outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
            />

          </div>

          {/* Authentication error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
              className="rounded-lg border border-burgundy/15 bg-burgundy/5 p-3 text-center text-xs text-burgundy"
            >
              {error}
            </motion.p>
          )}

          {/* Submit button */}
          <motion.button
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            type="submit"
            disabled={!canSubmit}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-burgundy text-sm font-medium text-ivory transition-opacity disabled:opacity-50"
          >

            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
                Unwrapping...
              </>
            ) : (
              <>
                Unwrap Your Gift
                <ArrowRight size={17} strokeWidth={1.5} />
              </>
            )}

          </motion.button>

        </form>

        {/* Privacy note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-muted">

          <LockKeyhole size={12} strokeWidth={1.5} />

          <p className="text-[10px] tracking-wide">
            A personal invitation, just for you.
          </p>

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">

          <p className="font-serif text-xl italic text-burgundy">
            With love, this Christmas.
          </p>

        </footer>

      </motion.div>

    </main>
  )
}
