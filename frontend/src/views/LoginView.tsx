import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { authenticate } from '../data/mockUsers'
import type { MockUser } from '../data/mockUsers'

interface Props {
  onLogin: (user: MockUser) => void
}

export default function LoginView({ onLogin }: Props) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const handleSubmit = async () => {
    if (!employeeId.trim() || !password.trim()) {
      setError('Preencha todos os campos')
      setShakeKey((k) => k + 1)
      return
    }

    setLoading(true)
    setError('')

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))

    const user = authenticate(employeeId.trim(), password)
    if (user) {
      onLogin(user)
    } else {
      setError('Credenciais inválidas. Verifique seu número de registro e senha.')
      setShakeKey((k) => k + 1)
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#0B0B12]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-5"
          >
            🤖
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Totem <span className="text-primary-light">IA</span>
          </h1>
          <p className="text-sm text-gray-500">
            Acesse sua central de onboarding
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <motion.div
            key={`id-${shakeKey}`}
            animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <label className="block text-xs text-gray-500 font-medium mb-1.5">
              Número de Registro
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ex: EMP-3841"
              className="w-full px-5 py-3.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-gray-600 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all duration-200"
              autoFocus
              autoComplete="off"
            />
          </motion.div>

          <motion.div
            key={`pw-${shakeKey}`}
            animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <label className="block text-xs text-gray-500 font-medium mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Digite sua senha"
              className="w-full px-5 py-3.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-gray-600 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all duration-200"
              autoComplete="off"
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red-400 text-xs text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed glow-hover transition-all mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Autenticando...
              </span>
            ) : (
              'Entrar no Totem'
            )}
          </motion.button>
        </motion.div>

        <p className="text-center text-[10px] text-gray-700 mt-8">
          Sistema interno • TechCorp Soluções
        </p>
      </motion.div>
    </div>
  )
}
