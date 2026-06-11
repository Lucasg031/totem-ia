import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { query } from '../db'
import { processMessage } from '../services/aiService'
import { checkAndEscalate } from '../services/escalationService'
import type { OnboardingPhase, AIMessage } from '../types'

export async function handleMessage(req: Request, res: Response) {
  try {
    const { userId, content, history } = req.body as {
      userId: string
      content: string
      history?: AIMessage[]
    }

    if (!userId || !content) {
      return res.status(400).json({ error: 'userId and content are required' })
    }

    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId])
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = userResult.rows[0]
    const phase: OnboardingPhase = user.onboarding_phase
    const roleTitle: string | null = user.role || null

    const { reply, sentiment } = await processMessage(content, history || [], phase, roleTitle)

    const msgId = uuid()
    await query(
      `INSERT INTO messages (id, user_id, content, role, sentiment, created_at)
       VALUES (?, ?, ?, 'user', ?, datetime('now'))`,
      [uuid(), userId, content, sentiment]
    )

    await query(
      `INSERT INTO messages (id, user_id, content, role, sentiment, created_at)
       VALUES (?, ?, ?, 'assistant', ?, datetime('now'))`,
      [msgId, userId, reply, sentiment]
    )

    const escalation = await checkAndEscalate(userId, sentiment, content)

    res.json({ reply, sentiment, escalation, messageId: msgId })
  } catch (error) {
    console.error('Error handling message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const result = await query(
      'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
