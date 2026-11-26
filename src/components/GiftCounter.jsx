
import {
  motion,
  AnimatePresence,
} from 'motion/react'
import { Gift } from 'lucide-react'

import { MAX_GIFTS } from '../utils/giftUtils'

export default function GiftCounter({
  count = 0,
}) {
  const remaining = MAX_GIFTS - count

  return (
    <div className="sticky top-0 z-40 border-b border-gold/30 bg-burgundy/95 px-4 pt-[calc(12px+env(safe-area-inset-top))] pb-3 text-ivory shadow-lg backdrop-blur-lg">

      <div className="flex items-center justify-between gap-3">

        {/* Animated remaining count */}
        <div className="min-w-0">

          <p className="text-[10px] uppercase tracking-widest text-gold-light">
            Your Wishlist
          </p>

          <AnimatePresence mode="wait" initial={false}>

            <motion.p
              key={remaining}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-medium"
              aria-live="polite"
            >
              {remaining === 0
                ? 'Wishlist complete!'
                : `${remaining} ${remaining === 1 ? 'gift' : 'gifts'} remaining`}
            </motion.p>

          </AnimatePresence>

        </div>

        {/* Animated gift icons */}
        <div className="flex shrink-0 gap-1.5">

          {Array.from(
            { length: MAX_GIFTS },
            (_, index) => {

              const filled = index < count

              return (
                <motion.div
                  key={`${index}-${filled}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 18,
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    filled
                      ? 'border-gold bg-gold text-burgundy'
                      : 'border-gold/30 bg-white/5 text-gold-light'
                  }`}
                >
                  <Gift size={15} strokeWidth={1.5} />
                </motion.div>
              )
            }
          )}

        </div>

      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">

        <motion.div
          initial={false}
          animate={{
            width: `${(count / MAX_GIFTS) * 100}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 130,
            damping: 20,
          }}
          className="h-full rounded-full bg-gold"
        />

      </div>

    </div>
  )
}
