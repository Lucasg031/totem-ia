import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'
import { getMessages, getCheckins, getEscalations } from '../services/api'
import type { SentimentLevel } from '../types'

interface Props {
  userId: string
  onBack: () => void
  onLogout: () => void
}

export default function ResumoView({ userId, onBack, onLogout }: Props) {
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalCheckins: 0,
    avgMood: 0,
    alertas: 0,
    sentiment: 'normal' as SentimentLevel,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [msgs, checkins, escs] = await Promise.all([
          getMessages(userId),
          getCheckins(userId),
          getEscalations(false),
        ])
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const weekMsgs = msgs.filter((m) => new Date(m.created_at).getTime() > weekAgo)
        const weekCheckins = checkins.filter((c) => new Date(c.created_at).getTime() > weekAgo)
        const avgMood = weekCheckins.length > 0
          ? weekCheckins.reduce((s, c) => s + c.mood, 0) / weekCheckins.length
          : 0

        let sentiment: SentimentLevel = 'normal'
        if (weekCheckins.some((c) => c.sentiment === 'critical') || escs.some((e) => !e.resolved)) {
          sentiment = 'critical'
        } else if (weekCheckins.some((c) => c.sentiment === 'attention')) {
          sentiment = 'attention'
        }

        setStats({
          totalMessages: weekMsgs.length,
          totalCheckins: weekCheckins.length,
          avgMood: Math.round(avgMood * 10) / 10,
          alertas: escs.filter((e) => !e.resolved).length,
          sentiment,
        })
      } catch {
        // fallback
      }
      setLoading(false)
    }
    load()
  }, [userId])

  const sentimentConfig: Record<SentimentLevel, { icon: string; label: string; color: string }> = {
    normal: { icon: '🟢', label: 'Normal', color: 'text-green-400' },
    attention: { icon: '🟡', label: 'Atenção', color: 'text-yellow-400' },
    critical: { icon: '🔴', label: 'Crítico', color: 'text-red-400' },
  }

  const sc = sentimentConfig[stats.sentiment]

  return (
    <AnimatedPage className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <span className="text-sm text-gray-500">📊 Resumo da Semana</span>
        </div>
        <LogoutButton onLogout={onLogout} />
      </header>

      <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="text-center mt-20">
            <div className="text-3xl mb-3 animate-pulse">📊</div>
            <p className="text-gray-500 text-sm">Carregando resumo...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Emotional State */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-surface-card border border-surface-border"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nível emocional médio</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sc.icon}</span>
                <span className={`text-lg font-semibold ${sc.color}`}>{sc.label}</span>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon="💬" label="Interações" value={String(stats.totalMessages)} delay={0.1} />
              <StatCard icon="📋" label="Check-ins" value={String(stats.totalCheckins)} delay={0.15} />
              <StatCard icon="⭐" label="Humor médio" value={stats.avgMood > 0 ? `${stats.avgMood}/5` : '—'} delay={0.2} />
              <StatCard icon="🔔" label="Alertas" value={String(stats.alertas)} delay={0.25} highlight={stats.alertas > 0} />
            </div>

            {/* Week summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-surface-card/50 border border-surface-border"
            >
              <p className="text-xs text-gray-500 mb-2">📌 Resumo rápido</p>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>• {stats.totalMessages > 0 ? `Você trocou ${stats.totalMessages} mensagens com o Totem.` : 'Nenhuma conversa esta semana.'}</li>
                <li>• {stats.totalCheckins > 0 ? `Fez ${stats.totalCheckins} check-in(s) emocional(is).` : 'Nenhum check-in registrado.'}</li>
                {stats.alertas > 0 && <li className="text-yellow-400">• 🔔 {stats.alertas} alerta(s) pendente(s).</li>}
                {stats.sentiment === 'normal' && <li>• ✅ Seu estado emocional está estável.</li>}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}

function StatCard({ icon, label, value, delay, highlight }: {
  icon: string; label: string; value: string; delay: number; highlight?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border ${highlight ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-surface-border bg-surface-card'}`}
    >
      <span className="text-lg">{icon}</span>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.div>
  )
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button onClick={onLogout}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all">
      <span>🚪</span> Sair
    </button>
  )
}
