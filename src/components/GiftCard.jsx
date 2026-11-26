
import { useState } from 'react'
import {
  Check,
  Gift,
  X,
  ImageIcon,
  ExternalLink,
} from 'lucide-react'
import { motion } from 'motion/react'

import {
  getGiftCount,
  getGiftImage,
  canSelectGift,
  formatLabel,
} from '../utils/giftUtils'

export default function GiftCard({
  gift,
  selection,
  selectedGifts = [],
  onSelect,
  onRemove,
  onUpdate,
}) {
  const { colors, formats, customs = [] } = gift

  const [draft, setDraft] = useState({
    color: gift.defaultColor,
    format: gift.defaultFormat,
    custom: gift.defaultCustom ?? null,
  })

  const [failedImages, setFailedImages] = useState([])

  const isSelected = Boolean(selection)
  const { color, format, custom } = selection || draft

  const isOriented =
    customs.includes('left') ||
    customs.includes('right')

  const giftCount = getGiftCount(format)
  const imagePath = getGiftImage(gift, color, format, custom)
  const canAdd = canSelectGift(gift, format, selectedGifts)

  // Update product options
  function updateOptions(changes) {
    const updated = {
      color,
      format,
      custom,
      ...changes,
    }

    if (
      isSelected &&
      !canSelectGift(gift, updated.format, selectedGifts)
    ) {
      return
    }

    setDraft(updated)

    if (isSelected) {
      onUpdate(gift.id, updated)
    }
  }

  // Select or remove gift
  function handleSelection() {
    if (isSelected) {
      setDraft({ color, format, custom })
      onRemove(gift.id)
      return
    }

    if (!canAdd) return

    onSelect({
      ...gift,
      color,
      format,
      custom,
    })
  }

  // Shared selector styling
  function optionClass(active) {
    return `min-h-11 rounded-md px-1 text-xs
      leading-tight transition-all ${
        active
          ? 'bg-white font-semibold text-burgundy shadow-sm'
          : 'text-muted'
      }`
  }

  return (
    <motion.article
      layout
      className={`flex min-w-0 flex-col overflow-hidden
        rounded-xl border bg-white transition-colors ${
          isSelected
            ? 'border-gold shadow-soft'
            : 'border-champagne'
        }`}
    >

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-white">

        {failedImages.includes(imagePath) ? (

          <div className="flex h-full flex-col items-center justify-center gap-2 bg-cream p-3 pb-14 text-center text-muted">
            <ImageIcon size={26} strokeWidth={1} />
            <span className="text-xs">
              Photo unavailable
            </span>
          </div>

        ) : (

          <motion.img
            key={imagePath}
            src={imagePath}
            alt={`${gift.name} in ${color}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full object-contain pb-10"
            loading="lazy"
            decoding="async"
            onError={() => {
              console.error('Image failed:', imagePath)

              setFailedImages(previous => [
                ...previous,
                imagePath,
              ])
            }}
          />

        )}

        {/* Product name and hyperlink overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-white via-white/95 to-transparent px-3 pb-2 pt-4">

          <h3 className="font-serif text-lg font-semibold leading-tight text-espresso">

            {gift.productUrl ? (

              <a
                href={gift.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-burgundy"
              >
                {gift.name}

                <ExternalLink
                  size={10}
                  className="ml-1 inline-block align-middle text-gold-dark"
                />
              </a>

            ) : gift.name}

          </h3>

          <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted">
            {gift.category}
          </p>

        </div>

        {/* Selected checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-burgundy text-ivory shadow-sm"
          >
            <Check size={15} />
          </motion.div>
        )}

      </div>

      {/* Product controls */}
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3">

        {/* Gold and silver swatches */}
        <div className="flex items-center justify-center gap-1">

          {colors.map(option => (
            <button
              key={option}
              type="button"
              title={formatLabel(option)}
              aria-label={`${gift.name} in ${option}`}
              aria-pressed={color === option}
              onClick={() =>
                updateOptions({ color: option })
              }
              className="flex h-11 w-11 items-center justify-center rounded-full"
            >

              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
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

        {/* Format and custom options */}
        <div className="mt-auto flex flex-col gap-2">

          {isOriented ? (

            /* Oriented studs: Left / Right / Pair */
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-cream p-1">

              {customs.map(option => (
                <button
                  key={option}
                  type="button"
                  disabled={
                    isSelected &&
                    !canSelectGift(gift, 'single', selectedGifts)
                  }
                  aria-pressed={
                    format === 'single' && custom === option
                  }
                  onClick={() =>
                    updateOptions({
                      format: 'single',
                      custom: option,
                    })
                  }
                  className={optionClass(
                    format === 'single' && custom === option
                  )}
                >
                  {formatLabel(option)}
                </button>
              ))}

              {formats.includes('pair') && (
                <button
                  type="button"
                  title="Mirrored Pair"
                  aria-label="Mirrored Pair"
                  aria-pressed={format === 'pair'}
                  disabled={
                    isSelected &&
                    !canSelectGift(gift, 'pair', selectedGifts)
                  }
                  onClick={() =>
                    updateOptions({
                      format: 'pair',
                      custom: null,
                    })
                  }
                  className={optionClass(format === 'pair')}
                >
                  Pair
                </button>
              )}

            </div>

          ) : (

            <>

              {/* Standard studs: Single / Pair */}
              {formats.length > 1 && (
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-cream p-1">

                  {formats.map(option => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={format === option}
                      disabled={
                        isSelected &&
                        !canSelectGift(gift, option, selectedGifts)
                      }
                      onClick={() =>
                        updateOptions({ format: option })
                      }
                      className={optionClass(format === option)}
                    >
                      {formatLabel(option)}
                    </button>
                  ))}

                </div>
              )}

              {/* Hoops: Regular / Small */}
              {customs.length > 1 && (
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-cream p-1">

                  {customs.map(option => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={custom === option}
                      onClick={() =>
                        updateOptions({ custom: option })
                      }
                      className={optionClass(custom === option)}
                    >
                      {formatLabel(option)}
                    </button>
                  ))}

                </div>
              )}

            </>

          )}

        </div>

        {/* Select or remove gift */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          aria-pressed={isSelected}
          disabled={!isSelected && !canAdd}
          onClick={handleSelection}
          className={`flex min-h-11 w-full items-center
            justify-center gap-1.5 rounded-lg px-2
            text-xs font-medium transition-colors ${
              isSelected
                ? 'bg-burgundy/10 text-burgundy'
                : 'bg-burgundy text-ivory'
            }`}
        >

          {isSelected ? (

            <>
              <X size={14} />
              Remove
            </>

          ) : (

            <>
              <Gift size={14} />

              {canAdd
                ? `Select · ${giftCount} ${giftCount === 1 ? 'gift' : 'gifts'}`
                : 'Not enough slots'}
            </>

          )}

        </motion.button>

      </div>

    </motion.article>
  )
}
