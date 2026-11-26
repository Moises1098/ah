
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Confirmation from './Confirmation'

import {
  X,
  Trash2,
  Gift,
  ImageIcon,
  ExternalLink,
  Send,
  LoaderCircle,
} from 'lucide-react'

import {
  MAX_GIFTS,
  getGiftCount,
  getTotalGiftCount,
  getGiftImage,
  canSelectGift,
  formatLabel,
} from '../utils/giftUtils'

export default function Wishlist({
  selectedGifts,
  onClose,
  onRemove,
  onUpdate,
  onComplete,
}) {
  const total = getTotalGiftCount(selectedGifts)
  const remaining = MAX_GIFTS - total

  const dialogRef = useRef(null)
  const submittingRef = useRef(false)

  const [failedImages, setFailedImages] = useState([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const canSubmit = total >= 1 && total <= MAX_GIFTS
  const locked = sending || sent

  // Open dialog and prevent background scrolling
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const dialog = dialogRef.current

    document.body.style.overflow = 'hidden'

    if (!dialog.open) {
      dialog.showModal()
    }

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Close wishlist
  function closeWishlist() {
    if (submittingRef.current) return

    if (sent) {
      onComplete()
      return
    }

    onClose()
  }

  // Update gift configuration
  function updateOptions(gift, changes) {
    if (locked) return

    const updated = {
      color: gift.color,
      format: gift.format,
      custom: gift.custom,
      ...changes,
    }

    if (
      canSelectGift(
        gift,
        updated.format,
        selectedGifts
      )
    ) {
      onUpdate(gift.id, updated)
    }
  }

  // Submit wishlist to the server
  async function submitWishlist() {
    if (!canSubmit || submittingRef.current || sent) return

    submittingRef.current = true
    setSending(true)
    setSubmissionError('')

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'same-origin',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          selections: selectedGifts.map(gift => ({
            id: gift.id,
            color: gift.color,
            format: gift.format,
            custom: gift.custom ?? null,
          })),
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error || 'Unable to send your wishlist.'
        )
      }

      setSent(true)

    } catch (error) {

      setSubmissionError(
        error.message || 'Something went wrong. Please try again.'
      )

    } finally {

      submittingRef.current = false
      setSending(false)

    }
  }

  // Shared selector styling
  function optionClass(active) {
    return `min-h-11 rounded-md px-2 text-xs
      leading-tight transition-all ${
        active
          ? 'bg-white font-semibold text-burgundy shadow-sm'
          : 'text-muted'
      }`
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="wishlist-title"
      onCancel={event => {
        event.preventDefault()
        closeWishlist()
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/40"
    >

      <div
        className="fixed inset-0 flex items-end justify-center"
        onClick={closeWishlist}
      >

        <motion.section
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 30,
          }}
          onClick={event => event.stopPropagation()}
          className="flex max-h-[90dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-3xl bg-ivory shadow-2xl"
        >

          {/* Sheet handle */}
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-champagne" />

          {sent ? (

            <Confirmation onClose={onComplete} />

          ) : (

            <>

              {/* Wishlist header */}
              <div className="shrink-0 border-b border-champagne px-5 py-4">

                <div className="flex items-center justify-between">

                  <div>

                    <h2
                      id="wishlist-title"
                      className="font-serif text-3xl leading-tight text-burgundy"
                    >
                      Your Wishlist
                    </h2>

                    <p className="mt-1 text-xs text-muted">
                      {total} of {MAX_GIFTS} gifts selected
                    </p>

                  </div>

                  <button
                    type="button"
                    aria-label="Close wishlist"
                    disabled={sending}
                    onClick={closeWishlist}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-burgundy"
                  >
                    <X size={20} />
                  </button>

                </div>

                {/* Gift indicators */}
                <div className="mt-4 flex gap-2">

                  {Array.from(
                    { length: MAX_GIFTS },
                    (_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: index < total ? 1 : 0.95,
                        }}
                        className={`flex h-8 flex-1 items-center justify-center rounded-md transition-colors ${
                          index < total
                            ? 'bg-burgundy text-ivory'
                            : 'bg-cream text-gold-dark'
                        }`}
                      >
                        <Gift size={15} strokeWidth={1.5} />
                      </motion.div>
                    )
                  )}

                </div>

              </div>

              {/* Scrollable wishlist */}
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">

                {/* Empty wishlist */}
                {selectedGifts.length === 0 && (

                  <div className="py-12 text-center text-muted">

                    <Gift
                      size={36}
                      strokeWidth={1}
                      className="mx-auto mb-3"
                    />

                    <p className="font-serif text-xl">
                      Your wishlist is empty.
                    </p>

                    <p className="mt-2 text-xs">
                      Find something that makes you sparkle.
                    </p>

                  </div>

                )}

                {selectedGifts.map(gift => {

                  const {
                    color,
                    format,
                    custom,
                    colors,
                    formats,
                    customs = [],
                  } = gift

                  const imagePath = getGiftImage(
                    gift,
                    color,
                    format,
                    custom
                  )

                  const giftCount = getGiftCount(format)

                  const isOriented =
                    customs.includes('left') ||
                    customs.includes('right')

                  return (
                    <motion.article
                      layout
                      key={gift.id}
                      className="rounded-xl border border-champagne bg-white p-3"
                    >

                      {/* Product overview */}
                      <div className="flex items-start gap-3">

                        {/* Product thumbnail */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">

                          {failedImages.includes(imagePath) ? (

                            <ImageIcon
                              size={26}
                              strokeWidth={1}
                              className="text-muted"
                            />

                          ) : (

                            <motion.img
                              key={imagePath}
                              src={imagePath}
                              alt={`${gift.name} in ${color}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="h-full w-full object-contain"
                              onError={() =>
                                setFailedImages(previous => [
                                  ...previous,
                                  imagePath,
                                ])
                              }
                            />

                          )}

                        </div>

                        {/* Product details */}
                        <div className="min-w-0 flex-1">

                          <h3 className="font-serif text-xl font-semibold leading-tight text-espresso">

                            {gift.productUrl ? (

                              <a
                                href={gift.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-burgundy"
                              >

                                {gift.name}

                                <ExternalLink
                                  size={10}
                                  className="ml-1 inline-block align-middle text-gold-dark"
                                />

                              </a>

                            ) : gift.name}

                          </h3>

                          <p className="mt-1 text-[10px] uppercase tracking-wide text-muted">
                            {gift.category}
                          </p>

                          <p className="mt-1 text-xs capitalize text-muted">

                            {color} ·{' '}

                            {isOriented && format === 'pair'
                              ? 'Mirrored Pair'
                              : formatLabel(format)}

                            {custom && ` · ${formatLabel(custom)}`}

                          </p>

                          <p className="mt-2 text-xs font-medium text-burgundy">

                            {giftCount}{' '}
                            {giftCount === 1 ? 'gift' : 'gifts'}

                          </p>

                        </div>

                        {/* Remove gift */}
                        <button
                          type="button"
                          aria-label={`Remove ${gift.name}`}
                          disabled={locked}
                          onClick={() => onRemove(gift.id)}
                          className="flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-burgundy hover:bg-burgundy/5"
                        >
                          <Trash2 size={17} strokeWidth={1.5} />
                        </button>

                      </div>

                      {/* Product controls */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-champagne/60 pt-2">

                        {/* Gold and silver */}
                        <div className="flex shrink-0 items-center">

                          {colors.map(option => (

                            <button
                              key={option}
                              type="button"
                              title={formatLabel(option)}
                              aria-label={`${gift.name} in ${option}`}
                              aria-pressed={color === option}
                              disabled={locked}
                              onClick={() =>
                                updateOptions(gift, {
                                  color: option,
                                })
                              }
                              className="flex h-11 w-11 items-center justify-center rounded-full"
                            >

                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                                  color === option
                                    ? 'border-burgundy'
                                    : 'border-transparent'
                                }`}
                              >

                                <span
                                  className={`h-5 w-5 rounded-full border border-black/10 ${
                                    option === 'gold'
                                      ? 'bg-linear-to-br from-[#F4E3A4] via-[#C9A66B] to-[#A88649]'
                                      : 'bg-linear-to-br from-[#F4F5F6] via-[#C3C8CF] to-[#9299A3]'
                                  }`}
                                />

                              </span>

                            </button>

                          ))}

                        </div>

                        {/* Format and custom selectors */}
                        <div className="flex min-w-[140px] flex-1 flex-col gap-1">

                          {isOriented ? (

                            /* Left / Right / Pair */
                            <div className="grid grid-cols-3 gap-1 rounded-lg bg-cream p-1">

                              {formats.includes('single') &&
                                customs.map(option => (

                                  <button
                                    key={option}
                                    type="button"
                                    aria-pressed={
                                      format === 'single' &&
                                      custom === option
                                    }
                                    disabled={
                                      locked ||
                                      !canSelectGift(
                                        gift,
                                        'single',
                                        selectedGifts
                                      )
                                    }
                                    onClick={() =>
                                      updateOptions(gift, {
                                        format: 'single',
                                        custom: option,
                                      })
                                    }
                                    className={optionClass(
                                      format === 'single' &&
                                      custom === option
                                    )}
                                  >

                                    {formatLabel(option)}

                                  </button>

                                ))}

                              {formats.includes('pair') && (

                                <button
                                  type="button"
                                  title="Mirrored Pair"
                                  aria-label={`Mirrored pair for ${gift.name}`}
                                  aria-pressed={format === 'pair'}
                                  disabled={
                                    locked ||
                                    !canSelectGift(
                                      gift,
                                      'pair',
                                      selectedGifts
                                    )
                                  }
                                  onClick={() =>
                                    updateOptions(gift, {
                                      format: 'pair',
                                      custom: null,
                                    })
                                  }
                                  className={optionClass(
                                    format === 'pair'
                                  )}
                                >
                                  Pair
                                </button>

                              )}

                            </div>

                          ) : (

                            <>

                              {/* Standard studs */}
                              {formats.length > 1 && (

                                <div className="grid grid-cols-2 gap-1 rounded-lg bg-cream p-1">

                                  {formats.map(option => (

                                    <button
                                      key={option}
                                      type="button"
                                      aria-pressed={format === option}
                                      disabled={
                                        locked ||
                                        !canSelectGift(
                                          gift,
                                          option,
                                          selectedGifts
                                        )
                                      }
                                      onClick={() =>
                                        updateOptions(gift, {
                                          format: option,
                                        })
                                      }
                                      className={optionClass(
                                        format === option
                                      )}
                                    >

                                      {formatLabel(option)}

                                    </button>

                                  ))}

                                </div>

                              )}

                              {/* Regular / Small hoops */}
                              {customs.length > 1 && (

                                <div className="grid grid-cols-2 gap-1 rounded-lg bg-cream p-1">

                                  {customs.map(option => (

                                    <button
                                      key={option}
                                      type="button"
                                      aria-pressed={custom === option}
                                      disabled={locked}
                                      onClick={() =>
                                        updateOptions(gift, {
                                          custom: option,
                                        })
                                      }
                                      className={optionClass(
                                        custom === option
                                      )}
                                    >

                                      {formatLabel(option)}

                                    </button>

                                  ))}

                                </div>

                              )}

                            </>

                          )}

                        </div>

                      </div>

                    </motion.article>
                  )
                })}

              </div>

              {/* Fixed submission footer */}
              <div className="shrink-0 border-t border-champagne bg-white px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">

                <form
                  onSubmit={event => {
                    event.preventDefault()
                    submitWishlist()
                  }}
                  className="flex flex-col gap-2"
                >

                  <p className="mb-1 text-center text-xs text-muted">

                    {total === 0
                      ? 'Select at least one gift to submit.'
                      : remaining === 0
                        ? 'Your wishlist is complete!'
                        : `You may choose ${remaining} more ${remaining === 1 ? 'gift' : 'gifts'}, if you wish.`}

                  </p>

                  {/* Submission error */}
                  {submissionError && (

                    <p
                      role="alert"
                      className="rounded-lg bg-burgundy/5 p-3 text-center text-xs text-burgundy"
                    >

                      {submissionError}

                    </p>

                  )}

                  {/* Submit wishlist */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!canSubmit || locked}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-burgundy text-sm font-medium text-ivory"
                  >

                    {sending ? (

                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />

                    ) : (

                      <Send size={17} strokeWidth={1.5} />

                    )}

                    {sending
                      ? 'Sending your wishlist...'
                      : 'Submit wishlist'}

                  </motion.button>

                  {/* Continue browsing */}
                  <button
                    type="button"
                    disabled={sending}
                    onClick={closeWishlist}
                    className="min-h-10 w-full text-xs font-medium text-muted hover:text-burgundy"
                  >
                    Continue browsing
                  </button>

                </form>

              </div>

            </>

          )}

        </motion.section>

      </div>

    </dialog>
  )
}
