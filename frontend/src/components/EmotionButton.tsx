import { motion } from 'framer-motion'

interface Props {
  emoji: string
  label: string
  value: number
  selected: boolean
  onClick: (value: number) => void
}

export default function EmotionButton({ emoji, label, value, selected, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => onClick(value)}
      className={`
        flex flex-col items-center gap-1 p-4 rounded-xl cursor-pointer
        transition-all duration-200
        ${selected
          ? 'bg-primary/30 border-2 border-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]'
          : 'bg-surface-card border-2 border-transparent hover:border-primary/40 hover:bg-surface-card/80'
        }
      `}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </motion.button>
  )
}
