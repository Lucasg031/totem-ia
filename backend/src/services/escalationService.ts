import { query } from '../db'
import type { SentimentLevel, Escalation } from '../types'
import { v4 as uuid } from 'uuid'

export async function checkAndEscalate(
  userId: string,
  sentiment: SentimentLevel,
  context: string
): Promise<Escalation | null> {
  if (sentiment !== 'critical') return null

  const id = uuid()
  await query(
    `INSERT INTO escalations (id, user_id, reason, level, resolved, created_at)
     VALUES (?, ?, ?, ?, 0, datetime('now'))`,
    [id, userId, context, sentiment]
  )

  await query(`UPDATE users SET risk_level = 'critical' WHERE id = ?`, [userId])

  const result = await query('SELECT * FROM escalations WHERE id = ?', [id])

  return result.rows[0] as Escalation
}

export async function getEscalations(resolved?: boolean): Promise<Escalation[]> {
  let sql = 'SELECT * FROM escalations'
  const params: any[] = []

  if (resolved !== undefined) {
    sql += ' WHERE resolved = ?'
    params.push(resolved ? 1 : 0)
  }

  sql += ' ORDER BY created_at DESC'

  const result = await query(sql, params)
  return result.rows as Escalation[]
}

export async function resolveEscalation(id: string): Promise<Escalation | null> {
  await query(
    `UPDATE escalations SET resolved = 1, resolved_at = datetime('now') WHERE id = ?`,
    [id]
  )

  const result = await query('SELECT * FROM escalations WHERE id = ?', [id])
  return result.rows[0] as Escalation || null
}
