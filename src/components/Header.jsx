
import { Gift, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

export default function Header({ selectedCount = 0 }) {
  return (
    <header className="relative overflow-hidden bg-burgundy px-8 py-16 text-center text-ivory">

      {/* Decorative borders */}
      <div className="pointer-events-none absolute inset-3 rounded-sm border border-gold/30" />
      <div className="pointer-events-none absolute inset-5 rounded-sm border border-gold/15" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-sm"
      >
        <Sparkles
          size={26}
          className="mx-auto mb-5 text-gold"
        />

        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-light">
          Christmas 2026
        </p>

        <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight">
          <span className="block">Choose Your</span>
          <span className="block">Christmas</span>
          <span className="block italic">Flat Backs</span>
        </h1>

        <div className="mx-auto my-7 h-px w-16 bg-gold/60" />

        <p className="mx-auto max-w-[300px] text-sm leading-relaxed text-ivory/80 text-balance">
          A little sparkle, chosen just for you.
          Pick up to four of your favorite gifts
          and make them your own.
        </p>

        {/* Gift selection counter */}
        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index < selectedCount ? 1.05 : 1
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                index < selectedCount
                  ? 'border-gold bg-gold text-burgundy'
                  : 'border-gold/30 bg-white/5 text-gold-light'
              }`}
            >
              <Gift size={19} strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>

        <p className="mt-4 text-xs tracking-[0.12em] text-gold-light">
          {selectedCount} OF 4 GIFTS SELECTED
        </p>
      </motion.div>
    </header>
  )
}
