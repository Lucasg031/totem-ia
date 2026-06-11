import type {
  User,
  Message,
  Checkin,
  Escalation,
  DashboardStats,
  ChatMessage,
} from '../types'

const BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function createUser(
  name: string,
  email: string,
  role?: string
): Promise<User> {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, role }),
  })
}

export async function getUser(id: string): Promise<User> {
  return request(`/users/${id}`)
}

export async function getAllUsers(): Promise<User[]> {
  return request('/users')
}

export async function updateUser(
  id: string,
  data: { name?: string; role?: string }
): Promise<User> {
  return request(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function updatePhase(
  id: string,
  phase: number
): Promise<User> {
  return request(`/users/${id}/phase`, {
    method: 'PATCH',
    body: JSON.stringify({ phase }),
  })
}

export async function sendMessage(
  userId: string,
  content: string,
  history?: { role: string; content: string }[]
): Promise<{
  reply: string
  sentiment: string
  escalation: Escalation | null
  messageId: string
}> {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({ userId, content, history }),
  })
}

export async function getMessages(userId: string): Promise<Message[]> {
  return request(`/messages/${userId}`)
}

export async function createCheckin(
  userId: string,
  mood: number,
  note?: string,
  isOffRecord?: boolean
): Promise<{ checkin: Checkin; sentiment: string; message: string }> {
  return request('/checkins', {
    method: 'POST',
    body: JSON.stringify({ userId, mood, note, isOffRecord }),
  })
}

export async function getCheckins(userId: string): Promise<Checkin[]> {
  return request(`/checkins/${userId}`)
}

export async function getEscalations(
  resolved?: boolean
): Promise<Escalation[]> {
  const params = resolved !== undefined ? `?resolved=${resolved}` : ''
  return request(`/escalations${params}`)
}

export async function resolveEscalation(id: string): Promise<Escalation> {
  return request(`/escalations/${id}/resolve`, { method: 'PATCH' })
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return request('/escalations/dashboard')
}
