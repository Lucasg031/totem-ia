import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { query } from '../db'
import { classifySentiment } from '../services/sentimentService'
import { checkAndEscalate } from '../services/escalationService'
import type { SentimentLevel } from '../types'

export async function createCheckin(req: Request, res: Response) {
  try {
    const { userId, mood, note, isOffRecord } = req.body as {
      userId: string
      mood: number
      note?: string
      isOffRecord?: boolean
    }

    if (!userId || mood === undefined) {
      return res.status(400).json({ error: 'userId and mood are required' })
    }

    const sentiment: SentimentLevel =
      mood === 1 ? 'critical' : mood <= 2 ? 'attention' : 'normal'

    const id = uuid()
    await query(
      `INSERT INTO checkins (id, user_id, mood, note, is_off_record, sentiment, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, userId, mood, note || '', isOffRecord ? 1 : 0, sentiment]
    )

    if (sentiment === 'critical' || sentiment === 'attention') {
      await query(`UPDATE users SET risk_level = $1 WHERE id = $2`, [sentiment, userId])

      if (sentiment === 'critical') {
        await checkAndEscalate(
          userId,
          sentiment,
          `Check-in emocional: humor ${mood}/5. Nota: ${note || 'sem observações'}`
        )
      }
    }

    const result = await query('SELECT * FROM checkins WHERE id = $1', [id])

    res.json({
      checkin: result.rows[0],
      sentiment,
      message: getMoodMessage(mood),
    })
  } catch (error) {
    console.error('Error creating checkin:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getCheckins(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const result = await query(
      'SELECT * FROM checkins WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching checkins:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function getMoodMessage(mood: number): string {
  if (mood >= 4) return 'Que bom que você está bem! Continue assim.'
  if (mood === 3) return 'Obrigado pela sinceridade. Estou aqui se precisar.'
  if (mood === 2) return 'Sinto que você não está tão bem. Quer conversar?'
  return 'Sinto muito que você está passando por isso. Vou sinalizar o RH para te apoiar.'
}
