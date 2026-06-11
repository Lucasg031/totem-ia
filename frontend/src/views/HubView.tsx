import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'
import NavButton from '../components/NavButton'
import type { User, SentimentLevel } from '../types'

interface Props {
  authUser: { employeeId: string; name: string }
  user: User
  alertCount: number
  onNavigate: (view: string) => void
  onStartChat: () => void
  onQuickAction: (action: string) => void
  onToggleRolePicker: () => void
  showRolePicker: boolean
  roles: string[]
  onSelectRole: (role: string) => void
  onLogout: () => void
}

const moodLabels: Record<SentimentLevel, { icon: string; label: string; color: string }> = {
  normal: { icon: '🟢', label: 'Tranquilo', color: 'text-green-400' },
  attention: { icon: '🟡', label: 'Atenção', color: 'text-yellow-400' },
  critical: { icon: '🔴', label: 'Crítico', color: 'text-red-400' },
}

export default function HubView({
  authUser, user, alertCount, onNavigate, onStartChat, onQuickAction,
  showRolePicker, roles, onSelectRole, onToggleRolePicker, onLogout,
}: Props) {
  const mood = moodLabels[user.risk_level]

  return (
    <AnimatedPage className="flex flex-col min-h-screen pt-8 pb-12 px-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-[11px] text-gray-600">{authUser.employeeId}</span>
        <LogoutButton onLogout={onLogout} />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-bold text-white">
            Totem <span className="text-primary-light">IA</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-gray-300">
              Olá, <span className="text-white font-semibold">{user.name?.split(' ')[0]}</span>
            </span>
            <button onClick={onToggleRolePicker} className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-light text-[11px] font-medium border border-primary/30 hover:bg-primary/30 transition-all cursor-pointer">
              {user.role || 'Definir cargo'} {showRolePicker ? '▲' : '▼'}
            </button>
          </div>

          {/* Mood Tracker */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className={mood.color}>{mood.icon}</span>
            <span className="text-xs text-gray-500">Estado emocional: <span className={mood.color}>{mood.label}</span></span>
          </div>
        </motion.div>
      </div>

      {/* Role Picker */}
      {showRolePicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-6"
        >
          <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto bg-surface-card rounded-xl p-3">
            {roles.map((r) => (
              <button key={r} onClick={() => onSelectRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  user.role === r
                    ? 'bg-primary/30 border-primary text-primary-light'
                    : 'bg-surface/50 border-surface-border text-gray-400 hover:border-primary/40 hover:text-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Menu */}
      <div className="max-w-lg mx-auto w-full space-y-2.5">
        <NavButton label="Conversar com o Totem IA" icon="💬" onClick={onStartChat} variant="primary" />
        <NavButton label="Minha Agenda do Mês" icon="📅" onClick={() => onNavigate('agenda')} variant="secondary" />
        <NavButton label="Meu Progresso no Onboarding" icon="🧠" onClick={() => onNavigate('progresso')} variant="secondary" />
        <NavButton label="Resumo da Minha Semana" icon="📊" onClick={() => onNavigate('resumo')} variant="secondary" />

        <div className="relative">
          <NavButton label="Alertas e Avisos" icon="🔔" onClick={() => onNavigate('alertas')} variant="secondary" />
          {alertCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
            >
              {alertCount}
            </motion.span>
          )}
        </div>

        <NavButton label="Configurações" icon="⚙️" onClick={() => onNavigate('configuracoes')} variant="secondary" />
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto w-full mt-8">
        <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3 text-center">Ações rápidas</p>
        <div className="grid grid-cols-3 gap-2">
          <QuickAction icon="🤝" label="Falar com RH" onClick={() => onQuickAction('rh')} />
          <QuickAction icon="🆘" label="Ajuda Urgente" onClick={() => onQuickAction('urgente')} />
          <QuickAction icon="📋" label="Check-in Rápido" onClick={() => onQuickAction('checkin')} />
        </div>
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

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-card border border-surface-border hover:border-primary/40 transition-all cursor-pointer"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] text-gray-400 font-medium leading-tight text-center">{label}</span>
    </motion.button>
  )
}
