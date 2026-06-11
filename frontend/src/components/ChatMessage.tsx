import { motion } from 'framer-motion'
import type { ChatMessage as ChatMessageType, SentimentLevel } from '../types'

interface Props {
  message: ChatMessageType
}

const sentimentColors: Record<SentimentLevel, string> = {
  normal: 'border-l-primary',
  attention: 'border-l-yellow-500',
  critical: 'border-l-red-500',
}

const sentimentGlow: Record<SentimentLevel, string> = {
  normal: 'shadow-[0_0_10px_rgba(124,58,237,0.15)]',
  attention: 'shadow-[0_0_10px_rgba(234,179,8,0.15)]',
  critical: 'shadow-[0_0_10px_rgba(239,68,68,0.15)]',
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] px-5 py-3 rounded-2xl
          ${isUser
            ? 'bg-primary/20 text-white rounded-br-md'
            : `bg-surface-card border-l-4 ${sentimentColors[message.sentiment]} ${sentimentGlow[message.sentiment]} text-gray-100 rounded-bl-md`
          }
        `}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  )
}
