import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(__dirname, '..', 'data', 'totem_ia.db')

let db: SqlJsDatabase

function saveDb() {
  const data = db.export()
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DB_PATH, Buffer.from(data))
}

function normalizeSql(sql: string): string {
  return sql.replace(/\$(\d+)/g, '?')
}

export async function initDb() {
  const SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA foreign_keys = ON')
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      onboarding_phase INTEGER NOT NULL DEFAULT 1,
      risk_level TEXT NOT NULL DEFAULT 'normal',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      sentiment TEXT NOT NULL DEFAULT 'normal',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
      note TEXT DEFAULT '',
      is_off_record INTEGER DEFAULT 0,
      sentiment TEXT NOT NULL DEFAULT 'normal',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS escalations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      reason TEXT NOT NULL,
      level TEXT NOT NULL,
      resolved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      resolved_at TEXT
    )
  `)

  saveDb()
  console.log('Database initialized at', DB_PATH)
}

export async function query(text: string, params?: any[]) {
  const sql = normalizeSql(text)
  const stmt = db.prepare(sql)

  if (params && params.length > 0) {
    const safeParams = params.map((p) => (typeof p === 'boolean' ? (p ? 1 : 0) : p))
    stmt.bind(safeParams as (number | string | null | Uint8Array)[])
  }

  const rows: any[] = []
  const upper = sql.trim().toUpperCase()

  if (upper.startsWith('SELECT') || upper.startsWith('WITH') || upper.includes('RETURNING')) {
    while (stmt.step()) {
      const row: any = stmt.getAsObject()
      if (row.resolved !== undefined) row.resolved = row.resolved === 1
      if (row.is_off_record !== undefined) row.is_off_record = row.is_off_record === 1
      rows.push(row)
    }
  } else {
    stmt.step()
  }

  stmt.free()
  saveDb()

  return { rows, rowCount: rows.length }
}

export async function getClient() {
  return db
}
