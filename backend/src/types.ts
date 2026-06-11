export type SentimentLevel = 'normal' | 'attention' | 'critical'
export type OnboardingPhase = 1 | 7 | 30 | 90

export interface User {
  id: string
  name: string
  email: string
  role: string
  onboardingPhase: OnboardingPhase
  createdAt: string
  riskLevel: SentimentLevel
}

export interface Message {
  id: string
  userId: string
  content: string
  role: 'user' | 'assistant'
  sentiment: SentimentLevel
  createdAt: string
}

export interface Checkin {
  id: string
  userId: string
  mood: number
  note: string
  isOffRecord: boolean
  sentiment: SentimentLevel
  createdAt: string
}

export interface Escalation {
  id: string
  userId: string
  reason: string
  level: SentimentLevel
  resolved: boolean
  createdAt: string
  resolvedAt: string | null
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
