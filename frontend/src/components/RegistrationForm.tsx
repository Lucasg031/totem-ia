import { useState } from 'react'
import { motion } from 'framer-motion'
import { createUser } from '../services/api'
import type { User } from '../types'

const ROLES = [
  'Desenvolvedor Júnior',
  'Desenvolvedor Pleno',
  'Desenvolvedor Sênior',
  'Tech Lead',
  'Designer',
  'UX Researcher',
  'Product Manager',
  'Analista de RH',
  'Analista de Dados',
  'Estagiário',
]

interface Props {
  onComplete: (user: User) => void
}

export default function RegistrationForm({ onComplete }: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'name' | 'role'>('name')

  const handleSubmitName = () => {
    if (!name.trim()) return
    setStep('role')
  }

  const handleSubmitRole = async () => {
    if (!role) return
    setSubmitting(true)
    try {
      const user = await createUser(
        name.trim(),
        `colaborador-${Date.now()}@empresa.com`,
        role
      )
      localStorage.setItem('totem_ia_user_id', user.id)
      onComplete(user)
    } catch {
      alert('Erro ao criar perfil. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo ao <span className="text-primary-light">Totem IA</span>
          </h1>
          <p className="text-gray-400">Vamos configurar seu perfil</p>
        </div>

        {step === 'name' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <label className="block text-sm text-gray-400 font-medium">
              Qual seu nome?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitName()}
              placeholder="Digite seu nome"
              className="w-full px-5 py-3.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-gray-500 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all duration-200"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitName}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed glow-hover transition-all"
            >
              Continuar
            </motion.button>
          </motion.div>
        )}

        {step === 'role' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <label className="block text-sm text-gray-400 font-medium">
              Qual seu cargo, {name.split(' ')[0]}?
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
              {ROLES.map((r) => (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(r)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                    role === r
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                      : 'bg-surface-card border-surface-border text-gray-300 hover:border-primary/40'
                  }`}
                >
                  {r}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('name')}
                className="flex-1 py-3.5 rounded-xl bg-surface-card border border-surface-border text-gray-300 font-medium transition-all"
              >
                Voltar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmitRole}
                disabled={!role || submitting}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed glow-hover transition-all"
              >
                {submitting ? 'Salvando...' : 'Começar'}
              </motion.button>
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs text-gray-600 mt-6">
          Suas informações são confidenciais • Apenas o RH tem acesso
        </p>
      </motion.div>
    </div>
  )
}
