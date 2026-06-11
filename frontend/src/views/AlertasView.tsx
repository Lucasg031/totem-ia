import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'
import { getEscalations } from '../services/api'

interface Props {
  userId: string
  onBack: () => void
  onLogout: () => void
}

export default function AlertasView({ userId, onBack, onLogout }: Props) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pending, resolved] = await Promise.all([
          getEscalations(false),
          getEscalations(true),
        ])
        setAlerts([
          ...pending.map((e) => ({ ...e, status: 'Pendente' as const })),
          ...resolved.map((e) => ({ ...e, status: 'Resolvido' as const })),
        ])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const systemAlerts = [
    { id: 's1', title: 'Bem-vindo ao Totem IA!', desc: 'Explore as funcionalidades do seu assistente de onboarding.', type: 'info', time: 'Hoje' },
    { id: 's2', title: 'Não se esqueça do check-in', desc: 'Registre como você está se sentindo hoje.', type: 'aviso', time: 'Ontem' },
    { id: 's3', title: 'Treinamento disponível', desc: 'Curso de Cultura e Valores liberado na plataforma.', type: 'info', time: '2 dias atrás' },
  ]

  return (
    <AnimatedPage className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <span className="text-sm text-gray-500">🔔 Alertas e Avisos</span>
        </div>
        <LogoutButton onLogout={onLogout} />
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="text-center mt-20">
            <div className="text-3xl mb-3 animate-pulse">🔔</div>
            <p className="text-gray-500 text-sm">Carregando...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* System Alerts */}
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Avisos do Sistema</p>
              <div className="space-y-2">
                {systemAlerts.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex items-start gap-3 p-3 rounded-xl border-l-4 ${
                      a.type === 'aviso' ? 'border-l-yellow-500' : 'border-l-primary'
                    } bg-surface-card`}
                  >
                    <span className="text-lg mt-0.5">{a.type === 'aviso' ? '⚠️' : 'ℹ️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{a.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Escalations */}
            {alerts.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Alertas do RH</p>
                <div className="space-y-2">
                  {alerts.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border-l-4 ${
                        a.status === 'Pendente' ? 'border-l-red-500' : 'border-l-green-500'
                      } bg-surface-card`}
                    >
                      <span className="text-lg mt-0.5">{a.status === 'Pendente' ? '🔴' : '✅'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">Escalonamento #{a.level}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.reason}</p>
                        <p className="text-[10px] text-gray-600 mt-1">
                          {a.status === 'Pendente' ? 'Pendente' : `Resolvido em ${a.resolved_at ? new Date(a.resolved_at).toLocaleDateString() : ''}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {alerts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-16"
              >
                <div className="text-4xl mb-3">✅</div>
                <p className="text-gray-400 text-sm">Nenhum alerta no momento.</p>
                <p className="text-gray-600 text-xs mt-1">Tudo tranquilo por aqui!</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
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
