import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { query } from '../db'
import type { OnboardingPhase, User } from '../types'

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, role } = req.body as {
      name: string
      email: string
      role?: string
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' })
    }

    const id = uuid()
    await query(
      `INSERT INTO users (id, name, email, role, onboarding_phase, risk_level, created_at)
       VALUES (?, ?, ?, ?, 1, 'normal', datetime('now'))`,
      [id, name, email, role || '']
    )

    const result = await query('SELECT * FROM users WHERE id = $1', [id])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM users WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updatePhase(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { phase } = req.body as { phase: OnboardingPhase }

    const validPhases: OnboardingPhase[] = [1, 7, 30, 90]
    if (!validPhases.includes(phase)) {
      return res.status(400).json({ error: 'Invalid phase. Use 1, 7, 30, or 90' })
    }

    await query('UPDATE users SET onboarding_phase = $1 WHERE id = $2', [phase, id])
    const result = await query('SELECT * FROM users WHERE id = $1', [id])

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating phase:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, role } = req.body as { name?: string; role?: string }

    const fields: string[] = []
    const params: any[] = []

    if (name !== undefined) {
      fields.push('name = ?')
      params.push(name)
    }
    if (role !== undefined) {
      fields.push('role = ?')
      params.push(role)
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    params.push(id)
    await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params)
    const result = await query('SELECT * FROM users WHERE id = ?', [id])

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
