import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-surface-card border-l-4 border-primary rounded-2xl rounded-bl-md px-5 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-light"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
