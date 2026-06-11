export type SentimentLevel = 'normal' | 'attention' | 'critical'
export type OnboardingPhase = 1 | 7 | 30 | 90
export type ViewName = 'home' | 'chat' | 'agenda' | 'progresso' | 'resumo' | 'alertas' | 'configuracoes'

export interface User {
  id: string
  name: string
  email: string
  role: string
  onboarding_phase: OnboardingPhase
  risk_level: SentimentLevel
  created_at: string
}

export interface Message {
  id: string
  user_id: string
  content: string
  role: 'user' | 'assistant'
  sentiment: SentimentLevel
  created_at: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  sentiment: SentimentLevel
}

export interface Checkin {
  id: string
  user_id: string
  mood: number
  note: string
  is_off_record: boolean
  sentiment: SentimentLevel
  created_at: string
}

export interface Escalation {
  id: string
  user_id: string
  reason: string
  level: SentimentLevel
  resolved: boolean
  created_at: string
  resolved_at: string | null
}

export interface DashboardStats {
  totalUsers: number
  criticalUsers: number
  attentionUsers: number
  pendingEscalations: number
  totalCheckins: number
  averageMood: number
}
