import { Request, Response } from 'express'
import { getEscalations, resolveEscalation } from '../services/escalationService'
import { query } from '../db'

export async function listEscalations(req: Request, res: Response) {
  try {
    const resolved = req.query.resolved !== undefined
      ? req.query.resolved === 'true'
      : undefined
    const escalations = await getEscalations(resolved)
    res.json(escalations)
  } catch (error) {
    console.error('Error listing escalations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function resolveEscalationEndpoint(req: Request, res: Response) {
  try {
    const { id } = req.params
    const escalation = await resolveEscalation(id)

    if (!escalation) {
      return res.status(404).json({ error: 'Escalation not found' })
    }

    res.json(escalation)
  } catch (error) {
    console.error('Error resolving escalation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const stats = {
      totalUsers: 0,
      criticalUsers: 0,
      attentionUsers: 0,
      pendingEscalations: 0,
      totalCheckins: 0,
      averageMood: 0,
    }

    const usersResult = await query(
      `SELECT
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN risk_level = ? THEN 1 END), 0) as critical,
        COALESCE(SUM(CASE WHEN risk_level = ? THEN 1 END), 0) as attention
      FROM users`,
      ['critical', 'attention']
    )

    const escalationResult = await query(
      'SELECT COUNT(*) as pending FROM escalations WHERE resolved = 0'
    )

    const checkinResult = await query(
      'SELECT COUNT(*) as total, COALESCE(AVG(mood), 0) as avg_mood FROM checkins'
    )

    if (usersResult.rows[0]) {
      stats.totalUsers = Number(usersResult.rows[0].total)
      stats.criticalUsers = Number(usersResult.rows[0].critical)
      stats.attentionUsers = Number(usersResult.rows[0].attention)
    }

    if (escalationResult.rows[0]) {
      stats.pendingEscalations = Number(escalationResult.rows[0].pending)
    }

    if (checkinResult.rows[0]) {
      stats.totalCheckins = Number(checkinResult.rows[0].total)
      stats.averageMood = Number(checkinResult.rows[0].avg_mood)
    }

    res.json(stats)
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
