import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'
import type { User, SentimentLevel } from '../types'

interface Props {
  user: User
}

const phaseData: Record<number, { label: string; description: string; color: string }> = {
  1: { label: 'Dia 1 · Integração Inicial', description: 'Boas-vindas, cultura da empresa e primeiros passos.', color: 'from-primary to-primary-light' },
  7: { label: 'Dia 7 · Primeira Semana', description: 'Ferramentas, equipe e processos operacionais.', color: 'from-primary-light to-blue-400' },
  30: { label: 'Dia 30 · Adaptação', description: 'Check-in de adaptação, feedback inicial e ajustes.', color: 'from-blue-400 to-green-400' },
  90: { label: 'Dia 90 · Review Final', description: 'Avaliação da experiência, feedback estruturado e próximos passos.', color: 'from-green-400 to-primary-light' },
}

const statusInfo: Record<SentimentLevel, { label: string; color: string; bg: string }> = {
  normal: { label: 'Adaptação saudável', color: 'text-green-400', bg: 'bg-green-500/10' },
  attention: { label: 'Necessita atenção', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  critical: { label: 'Risco — RH notificado', color: 'text-red-400', bg: 'bg-red-500/10' },
}

const milestones = [
  { day: 1, label: 'Boas-vindas', done: true },
  { day: 7, label: '1ª Semana', done: true },
  { day: 14, label: '14 Dias', done: false },
  { day: 30, label: '30 Dias', done: false },
  { day: 60, label: '60 Dias', done: false },
  { day: 90, label: '90 Dias', done: false },
]

export default function ProgressoView({ user, onBack, onLogout }: Props & { onBack: () => void; onLogout: () => void }) {
  const phase = user.onboarding_phase || 1
  const info = phaseData[phase] || phaseData[1]
  const status = statusInfo[user.risk_level]
  const progress = Math.min((phase / 90) * 100, 100)

  const PhaseIcon = () => {
    if (phase <= 1) return '🚀'
    if (phase <= 7) return '📚'
    if (phase <= 30) return '🧠'
    return '🎯'
  }

  return (
    <AnimatedPage className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <span className="text-sm text-gray-500">🧠 Meu Progresso</span>
        </div>
        <LogoutButton onLogout={onLogout} />
      </header>

      <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {/* Fase atual */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">{PhaseIcon()}</div>
          <h2 className="text-xl font-bold text-white mb-1">{info.label}</h2>
          <p className="text-sm text-gray-400">{info.description}</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Dia {phase}</span>
            <span>Meta: 90 dias</span>
          </div>
          <div className="h-3 rounded-full bg-surface-card overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${info.color}`}
            />
          </div>
          <p className="text-right text-xs text-gray-600 mt-1">{Math.round(progress)}% concluído</p>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`p-4 rounded-xl ${status.bg} border border-surface-border mb-8`}
        >
          <p className="text-xs text-gray-500 mb-1">Status de adaptação</p>
          <p className={`text-sm font-medium ${status.color}`}>{status.label}</p>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Marcos do Onboarding</p>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <motion.div
                key={m.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  m.done ? 'border-primary/30 bg-primary/10' : 'border-surface-border bg-surface-card/50'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  m.done ? 'bg-primary text-white' : 'bg-surface-border text-gray-500'
                }`}>
                  {m.done ? '✓' : m.day}
                </span>
                <span className={`text-sm ${m.done ? 'text-white' : 'text-gray-500'}`}>{m.label}</span>
                {m.done && <span className="ml-auto text-[10px] text-primary-light">Concluído</span>}
              </motion.div>
            ))}
          </div>
        </motion.div>
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
