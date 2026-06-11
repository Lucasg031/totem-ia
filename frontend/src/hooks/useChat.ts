import { useState, useCallback, useRef } from 'react'
import type { ChatMessage, SentimentLevel } from '../types'
import { sendMessage } from '../services/api'

export function useChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastSentiment, setLastSentiment] = useState<SentimentLevel>('normal')
  const idCounter = useRef(0)

  const addMessage = useCallback(
    (content: string, role: 'user' | 'assistant', sentiment: SentimentLevel) => {
      const msg: ChatMessage = {
        id: `msg-${++idCounter.current}`,
        content,
        role,
        sentiment,
      }
      setMessages((prev) => [...prev, msg])
      return msg
    },
    []
  )

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      addMessage(content, 'user', 'normal')
      setIsLoading(true)

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const result = await sendMessage(userId, content, history)
        const sentiment = result.sentiment as SentimentLevel
        setLastSentiment(sentiment)
        addMessage(result.reply, 'assistant', sentiment)
      } catch (err) {
        addMessage(
          'Desculpe, ocorreu um erro. Tente novamente.',
          'assistant',
          'normal'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [userId, messages, isLoading, addMessage]
  )

  return { messages, send, isLoading, lastSentiment }
}
