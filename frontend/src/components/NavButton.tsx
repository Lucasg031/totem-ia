import { motion } from 'framer-motion'

interface Props {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  icon?: string
}

export default function NavButton({ label, onClick, variant = 'primary', icon }: Props) {
  const base = 'relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold cursor-pointer border transition-all duration-200 overflow-hidden'

  const styles = variant === 'primary'
    ? 'bg-primary text-white border-primary hover:bg-primary-dark active:scale-[0.97]'
    : 'bg-transparent text-primary-light border-primary/30 hover:bg-primary/10 active:scale-[0.97]'

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${base} ${styles} glow-hover`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {label}
    </motion.button>
  )
}
