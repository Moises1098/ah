
import { motion } from 'motion/react'
import { CheckCircle2, Sparkles } from 'lucide-react'

export default function Confirmation({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-y-auto px-8 pt-12 pb-[calc(40px+env(safe-area-inset-bottom))] text-center"
    >

      {/* Decorations */}
      <Sparkles
        size={24}
        strokeWidth={1}
        className="absolute left-8 top-12 text-gold/40"
      />

      <Sparkles
        size={20}
        strokeWidth={1}
        className="absolute right-8 top-24 text-gold/40"
      />

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10"
      >

        <CheckCircle2
          size={42}
          strokeWidth={1.5}
          className="text-gold-dark"
        />

      </motion.div>

      {/* Heading */}
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-dark">
        Christmas 2026
      </p>

      <h2
        id="wishlist-title"
        className="font-serif text-4xl font-medium leading-tight text-burgundy"
      >
        Wishlist Sent!
      </h2>

      <div className="mx-auto my-6 h-px w-16 bg-gold/60" />

      {/* Confirmation message */}
      <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted">
        Your Christmas wishes have been received.
        A little holiday magic is on its way.
      </p>

      <p className="mt-6 font-serif text-3xl italic text-burgundy">
        Merry Christmas!
      </p>

      {/* Done button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onClose}
        className="mt-8 min-h-12 w-full rounded-xl bg-burgundy text-sm font-medium text-ivory"
      >
        Done
      </motion.button>

    </motion.div>
  )
}
