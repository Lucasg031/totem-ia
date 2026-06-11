import express from 'express'
import cors from 'cors'
import path from 'path'
import { initDb } from './db'
import messageRoutes from './routes/messageRoutes'
import checkinRoutes from './routes/checkinRoutes'
import userRoutes from './routes/userRoutes'
import escalationRoutes from './routes/escalationRoutes'

const app = express()
const PORT = Number(process.env.PORT) || 3001
const isProduction = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

// API routes
app.use('/api/messages', messageRoutes)
app.use('/api/checkins', checkinRoutes)
app.use('/api/users', userRoutes)
app.use('/api/escalations', escalationRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve frontend static files in production
if (isProduction) {
  const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist')
  app.use(express.static(frontendDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
  console.log(`Serving frontend from ${frontendDist}`)
}

async function start() {
  try {
    await initDb()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Totem IA Backend running on http://0.0.0.0:${PORT}`)
      if (isProduction) {
        console.log(`Production mode — frontend served at http://0.0.0.0:${PORT}`)
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
