import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'
import type { User } from '../types'

interface Props {
  user: User
  onBack: () => void
  onLogout: () => void
}

export default function ConfiguracoesView({ user, onBack, onLogout }: Props) {
  const [cleared, setCleared] = useState(false)

  const handleClearData = () => {
    localStorage.clear()
    setCleared(true)
    setTimeout(() => window.location.reload(), 1500)
  }

  const items = [
    { icon: '👤', label: 'Nome', value: user.name },
    { icon: '📧', label: 'Email', value: user.email },
    { icon: '💼', label: 'Cargo', value: user.role || 'Não definido' },
    { icon: '📅', label: 'Fase de onboarding', value: `Dia ${user.onboarding_phase}` },
    { icon: '🆔', label: 'ID', value: user.id.slice(0, 8) + '...' },
  ]

  return (
    <AnimatedPage className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <span className="text-sm text-gray-500">⚙️ Configurações</span>
        </div>
        <LogoutButton onLogout={onLogout} />
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Profile */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Meu Perfil</p>
          <div className="bg-surface-card rounded-xl border border-surface-border divide-y divide-surface-border">
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm text-white truncate">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Privacidade</p>
          <div className="bg-surface-card rounded-xl border border-surface-border p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🔒</span>
              <div>
                <p className="text-sm text-white font-medium">Dados confidenciais</p>
                <p className="text-xs text-gray-500 mt-1">
                  Suas conversas e check-ins são confidenciais. Apenas o RH tem acesso a dados anonimizados e alertas de risco.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Dados Locais</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClearData}
            disabled={cleared}
            className="w-full p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-medium disabled:opacity-40 transition-all"
          >
            {cleared ? '✅ Dados limpos! Recarregando...' : '🗑️ Limpar dados locais e reiniciar'}
          </motion.button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">Totem IA v1.0 • TechCorp Soluções</p>
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
