
import { useState, useEffect } from 'react'

import {
  ShoppingBag,
  ChevronRight,
  Gift,
  Sparkles,
  LoaderCircle,
} from 'lucide-react'

import { motion } from 'motion/react'

import Header from './components/Header'
import GiftGrid from './components/GiftGrid'
import GiftCounter from './components/GiftCounter'
import Wishlist from './components/Wishlist'
import Login from './components/Login'

import { gifts } from './data/gifts'

import {
  MAX_GIFTS,
  getTotalGiftCount,
  canSelectGift,
} from './utils/giftUtils'

const STORAGE_KEY = 'christmas-wishlist-v3'
const COMPLETED_KEY = 'christmas-wishlist-completed-v1'

// Resolve valid custom options for a product
function getAvailableCustoms(gift, format) {
  const customs = gift.customs || []

  const isOriented =
    customs.includes('left') ||
    customs.includes('right')

  if (isOriented && format !== 'single') {
    return []
  }

  return customs
}

// Validate and normalize product options
function normalizeOptions(gift, options) {
  const color = gift.colors.includes(options.color)
    ? options.color
    : gift.defaultColor

  const format = gift.formats.includes(options.format)
    ? options.format
    : gift.defaultFormat

  const customs = getAvailableCustoms(gift, format)

  let custom = null

  if (customs.length > 0) {
    if (customs.includes(options.custom)) {
      custom = options.custom
    } else if (customs.includes(gift.defaultCustom)) {
      custom = gift.defaultCustom
    } else {
      custom = customs[0]
    }
  }

  return { color, format, custom }
}

// Christmas collection
function Collection({ onComplete }) {
  const [wishlistOpen, setWishlistOpen] = useState(false)

  // Load saved selections
  const [selectedGifts, setSelectedGifts] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      )

      if (!Array.isArray(saved)) return []

      const restored = []

      for (const item of saved) {
        const gift = gifts.find(
          product => product.id === item?.id
        )

        if (
          !gift ||
          restored.some(product => product.id === gift.id)
        ) {
          continue
        }

        const options = normalizeOptions(gift, item)

        if (canSelectGift(gift, options.format, restored)) {
          restored.push({
            ...gift,
            ...options,
          })
        }
      }

      return restored

    } catch {
      return []
    }
  })

  // Calculate total number of individual gifts
  const total = getTotalGiftCount(selectedGifts)

  // Save selections
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          selectedGifts.map(
            ({ id, color, format, custom }) => ({
              id,
              color,
              format,
              custom,
            })
          )
        )
      )
    } catch (error) {
      console.error('Unable to save wishlist:', error)
    }
  }, [selectedGifts])

  // Add gift
  function addGift(gift) {
    setSelectedGifts(previous => {

      if (previous.some(item => item.id === gift.id)) {
        return previous
      }

      const options = normalizeOptions(gift, gift)

      if (!canSelectGift(gift, options.format, previous)) {
        return previous
      }

      return [
        ...previous,
        {
          ...gift,
          ...options,
        },
      ]
    })
  }

  // Remove gift
  function removeGift(id) {
    setSelectedGifts(previous =>
      previous.filter(gift => gift.id !== id)
    )
  }

  // Update color, format, or custom option
  function updateGift(id, changes) {
    setSelectedGifts(previous => {

      const gift = previous.find(item => item.id === id)

      if (!gift) return previous

      const options = normalizeOptions(gift, {
        ...gift,
        ...changes,
      })

      if (!canSelectGift(gift, options.format, previous)) {
        return previous
      }

      const updated = {
        ...gift,
        ...options,
      }

      return previous.map(item =>
        item.id === id ? updated : item
      )
    })
  }

  return (
    <main className="min-h-dvh bg-ivory pb-[calc(112px+env(safe-area-inset-bottom))]">

      {/* Christmas header */}
      <Header selectedCount={total} />

      {/* Sticky animated counter */}
      <GiftCounter count={total} />

      {/* Product collection */}
      <section className="px-4 py-8">

        <div className="mb-7 text-center">

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-dark">
            The Collection
          </p>

          <h2 className="font-serif text-burgundy">
            Find Your Favorites
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted">
            Choose up to four gifts and customize
            them just for you.
          </p>

          <p className="mt-2 text-xs text-gold-dark">
            Singles count as one gift.
            Pairs and hoops count as two.
          </p>

        </div>

        <GiftGrid
          selectedGifts={selectedGifts}
          onSelect={addGift}
          onRemove={removeGift}
          onUpdate={updateGift}
        />

      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">

        <div className="mx-auto mb-4 h-px w-16 bg-gold/50" />

        <p className="font-serif text-xl italic text-burgundy">
          A little sparkle for the holidays.
        </p>

        <p className="mt-2 text-xs text-muted">
          Christmas 2026 · Made with love
        </p>

      </footer>

      {/* Fixed wishlist button */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-champagne bg-ivory/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-lg">

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setWishlistOpen(true)}
          disabled={total === 0}
          className="flex min-h-14 w-full items-center gap-3 rounded-xl bg-burgundy px-4 text-sm font-medium text-ivory"
        >

          <ShoppingBag size={20} />

          <span>View my wishlist</span>

          <motion.span
            key={total}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-gold-light"
          >
            {total}/{MAX_GIFTS}
          </motion.span>

          <ChevronRight size={18} />

        </motion.button>

      </div>

      {/* Wishlist review panel */}
      {wishlistOpen && (
        <Wishlist
          selectedGifts={selectedGifts}
          onClose={() => setWishlistOpen(false)}
          onRemove={removeGift}
          onUpdate={updateGift}
          onComplete={onComplete}
        />
      )}

    </main>
  )
}

// Loading screen
function LoadingScreen() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center bg-ivory px-8">

      <Gift
        size={42}
        strokeWidth={1.2}
        className="mb-6 text-gold"
      />

      <LoaderCircle
        size={22}
        strokeWidth={1.5}
        className="mb-4 animate-spin text-burgundy"
      />

      <p className="font-serif text-2xl italic text-burgundy">
        Preparing a little Christmas magic...
      </p>

    </main>
  )
}

// Final goodbye screen
function GoodbyeScreen({ logoutError, onRetry }) {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center overflow-hidden bg-ivory px-8 py-12">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm text-center"
      >

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 bg-gold/10">

          <Gift
            size={44}
            strokeWidth={1.2}
            className="text-gold-dark"
          />

        </div>

        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gold-dark">
          Christmas 2026
        </p>

        <h1 className="font-serif text-5xl font-medium leading-tight text-burgundy">
          Until Christmas!
        </h1>

        <p className="mt-4 font-serif text-3xl italic text-burgundy">
          With love, always.
        </p>

        <div className="mx-auto my-8 h-px w-16 bg-gold" />

        <p className="text-sm leading-relaxed text-muted">
          Your wishlist has been submitted successfully.
        </p>

        {logoutError ? (
          <div className="mt-5">

            <p
              role="alert"
              className="text-xs text-burgundy"
            >
              Unable to end your login session.
              Please try again.
            </p>

            <button
              type="button"
              onClick={onRetry}
              className="mt-4 min-h-12 w-full rounded-xl bg-burgundy text-sm text-ivory"
            >
              Finish and close
            </button>

          </div>
        ) : (
          <p className="mt-4 text-xs text-muted">
            You may now close this page.
          </p>
        )}

        <Sparkles
          size={26}
          strokeWidth={1.2}
          className="mx-auto mt-12 text-gold"
        />

      </motion.div>

    </main>
  )
}

// Authentication gate
function App() {
  const [status, setStatus] = useState('loading')
  const [logoutError, setLogoutError] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  // Check whether the wishlist has already been submitted
  // and whether an authenticated session exists.
  useEffect(() => {
    const controller = new AbortController()

    async function checkSession() {
      try {
        let completed = false

        try {
          completed =
            sessionStorage.getItem(COMPLETED_KEY) === 'true'
        } catch {
          // Storage may be unavailable.
        }

        if (completed) {
          setStatus('completed')

          try {
            const response = await fetch('/api/logout', {
              method: 'POST',
              credentials: 'same-origin',
              signal: controller.signal,
            })

            if (!response.ok) {
              throw new Error('Logout failed')
            }

          } catch (error) {
            if (error.name !== 'AbortError') {
              setLogoutError(true)
            }
          }

          return
        }

        const response = await fetch('/api/session', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to verify session')
        }

        const data = await response.json()

        if (data.authenticated === true) {
          setStatus('authenticated')
        } else {
          setStatus('login')
        }

      } catch (error) {
        if (error.name !== 'AbortError') {
          setSessionError(true)
          setStatus('login')
        }
      }
    }

    checkSession()

    return () => controller.abort()
  }, [])

  // Successful login
  function handleLogin() {
    setSessionError(false)
    setStatus('authenticated')
  }

  // Finish wishlist, log out and attempt to close the tab
  async function handleComplete() {
    setLogoutError(false)
    setStatus('completed')

    // Prevent accidental re-entry after refreshing
    try {
      sessionStorage.setItem(COMPLETED_KEY, 'true')
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Continue even if browser storage is unavailable.
    }

    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Attempt to close the browser tab.
      // Manually opened tabs may block this.
      window.close()

    } catch {
      setLogoutError(true)
    }
  }

  // Checking existing session
  if (status === 'loading') {
    return <LoadingScreen />
  }

  // Wishlist already completed
  if (status === 'completed') {
    return (
      <GoodbyeScreen
        logoutError={logoutError}
        onRetry={handleComplete}
      />
    )
  }

  // Require authentication
  if (status === 'login') {
    return (
      <>
        {sessionError && (
          <p
            role="alert"
            className="bg-ivory p-3 text-center text-xs text-burgundy"
          >
            Unable to verify your session.
            Please try signing in.
          </p>
        )}

        <Login onLogin={handleLogin} />
      </>
    )
  }

  // Authenticated collection
  return (
    <Collection onComplete={handleComplete} />
  )
}

export default App
