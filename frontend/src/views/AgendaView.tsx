import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'

interface Event {
  day: number
  weekday: string
  title: string
  type: 'rh' | 'treinamento' | 'avaliacao' | 'social'
  time: string
}

const events: Event[] = [
  { day: 12, weekday: 'Qua', title: 'Reunião com RH — Onboarding', type: 'rh', time: '10:00' },
  { day: 14, weekday: 'Sex', title: 'Check-in com líder direto', type: 'avaliacao', time: '14:30' },
  { day: 18, weekday: 'Ter', title: 'Treinamento: Cultura e Valores', type: 'treinamento', time: '09:00' },
  { day: 21, weekday: 'Sex', title: 'Avaliação 30 dias', type: 'avaliacao', time: '11:00' },
  { day: 25, weekday: 'Ter', title: 'Workspace: Boas-vindas equipe', type: 'social', time: '16:00' },
  { day: 28, weekday: 'Sex', title: 'Treinamento: Ferramentas Internas', type: 'treinamento', time: '09:30' },
]

const typeConfig = {
  rh: { bg: 'bg-primary/20', border: 'border-primary', text: 'text-primary-light', icon: '🤝' },
  treinamento: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', icon: '📚' },
  avaliacao: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: '📋' },
  social: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', icon: '🎉' },
}

export default function AgendaView({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const today = 11
  const upcoming = events.filter((e) => e.day >= today)
  const grouped: Record<string, Event[]> = {}
  upcoming.forEach((e) => {
    const key = `${e.day}/${e.weekday}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(e)
  })

  return (
    <AnimatedPage className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <span className="text-sm text-gray-500">📅 Minha Agenda</span>
        </div>
        <LogoutButton onLogout={onLogout} />
      </header>

      <div className="flex-1 px-4 py-6 max-w-xl mx-auto w-full">
        {Object.entries(grouped).map(([key, evts]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5"
          >
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">{key}</p>
            <div className="space-y-2">
              {evts.map((evt, i) => {
                const cfg = typeConfig[evt.type]
                const isToday = evt.day === today
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-l-4 ${cfg.border} ${cfg.bg} ${isToday ? 'ring-1 ring-primary/40' : ''}`}
                  >
                    <span className="text-lg">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{evt.title}</p>
                      <p className="text-xs text-gray-500">{evt.time}</p>
                    </div>
                    {isToday && <span className="text-[10px] font-semibold text-primary-light bg-primary/20 px-2 py-0.5 rounded-full">HOJE</span>}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {upcoming.length === 0 && (
          <div className="text-center mt-20">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-400">Nenhum evento agendado.</p>
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
