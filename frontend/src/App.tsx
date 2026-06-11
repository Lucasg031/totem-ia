import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { getUser, updateUser, sendMessage, createUser, getEscalations } from './services/api'
import type { User, ViewName, SentimentLevel } from './types'
import type { MockUser } from './data/mockUsers'

import HubView from './views/HubView'
import AgendaView from './views/AgendaView'
import ProgressoView from './views/ProgressoView'
import ResumoView from './views/ResumoView'
import AlertasView from './views/AlertasView'
import ConfiguracoesView from './views/ConfiguracoesView'
import LoginView from './views/LoginView'

import AnimatedPage from './components/AnimatedPage'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'
import InstallPWA from './components/InstallPWA'

const ROLES = [
  'Desenvolvedor Júnior', 'Desenvolvedor Pleno', 'Desenvolvedor Sênior',
  'Tech Lead', 'Designer', 'UX Researcher', 'Product Manager',
  'Analista de RH', 'Analista de Dados', 'Estagiário',
]

interface ChatMsg {
  id: string; content: string; role: 'user' | 'assistant'; sentiment: SentimentLevel
}

export default function App() {
  // Auth state
  const [authUser, setAuthUser] = useState<MockUser | null>(null)

  // Backend user state
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(false)

  // Navigation
  const [view, setView] = useState<ViewName>('home')
  const [showRolePicker, setShowRolePicker] = useState(false)
  const [alertCount, setAlertCount] = useState(0)

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [lastSentiment, setLastSentiment] = useState<SentimentLevel>('normal')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatLoading])

  // Load or create backend user after auth
  useEffect(() => {
    if (!authUser) {
      setUser(null)
      return
    }

    const initBackendUser = async () => {
      setUserLoading(true)
      try {
        const storedBackendId = localStorage.getItem(`be_${authUser.employeeId}`)
        if (storedBackendId) {
          const existing = await getUser(storedBackendId)
          if (existing.name === authUser.name) {
            setUser(existing)
            setUserLoading(false)
            // Load alert count
            try {
              const escs = await getEscalations(false)
              setAlertCount(escs.length)
            } catch {}
            return
          }
        }
        // Create backend user
        const newUser = await createUser(
          authUser.name,
          `${authUser.employeeId.toLowerCase()}@techcorp.com`,
          authUser.role || 'Colaborador'
        )
        localStorage.setItem(`be_${authUser.employeeId}`, newUser.id)
        setUser(newUser)
      } catch {
        console.warn('Backend offline — auth-only mode')
      }
      setUserLoading(false)
    }

    initBackendUser()
  }, [authUser])

  // Navigation
  const navigate = useCallback((v: string) => {
    if (v === 'home') setShowRolePicker(false)
    setView(v as ViewName)
  }, [])

  const logout = useCallback(() => {
    setAuthUser(null)
    setUser(null)
    setView('home')
    setMessages([])
    setAlertCount(0)
    setChatInput('')
  }, [])

  const openChat = useCallback(() => {
    setMessages([])
    setLastSentiment('normal')
    setView('chat')
  }, [])

  const handleSelectRole = useCallback(async (role: string) => {
    if (!user) return
    try {
      const updated = await updateUser(user.id, { role })
      setUser(updated)
      setShowRolePicker(false)
    } catch {}
  }, [user])

  const handleQuickAction = useCallback((action: string) => {
    if (!user) return
    if (action === 'rh' || action === 'urgente') {
      const prefix = action === 'urgente'
        ? 'Preciso de ajuda urgente'
        : 'Gostaria de falar com o RH'
      setView('chat')
      setTimeout(() => handleChatSend(prefix), 400)
    }
    if (action === 'checkin') {
      const prefix = 'Quero fazer um check-in emocional'
      setView('chat')
      setTimeout(() => handleChatSend(prefix), 400)
    }
  }, [user])

  const handleChatSend = useCallback(async (text?: string) => {
    const msg = text || chatInput
    if (!msg.trim() || !user || chatLoading) return
    setChatInput('')
    setChatLoading(true)

    setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, content: msg, role: 'user', sentiment: 'normal' }])

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const result = await sendMessage(user.id, msg, history)
      const s = result.sentiment as SentimentLevel
      setLastSentiment(s)
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}-r`, content: result.reply, role: 'assistant', sentiment: s }])
      if (s === 'critical') setAlertCount((c) => c + 1)
    } catch {
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}-e`, content: 'Desculpe, ocorreu um erro. Tente novamente.', role: 'assistant', sentiment: 'normal' }])
    }
    setChatLoading(false)
  }, [user, chatInput, messages, chatLoading])

  // Not logged in — show Login
  if (!authUser) {
    return <LoginView onLogin={setAuthUser} />
  }

  // Logged in but backend user not ready
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0B12]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🤖</div>
          <p className="text-gray-400">Preparando seu ambiente...</p>
        </div>
      </div>
    )
  }

  const sentimentColors: Record<string, string> = {
    normal: 'text-primary-light', attention: 'text-yellow-400', critical: 'text-red-400',
  }

  // Chat view (inline, state-based)
  const renderChat = () => (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
        <button onClick={() => navigate('home')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <span className="text-lg">←</span>Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 ${sentimentColors[lastSentiment]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sentimentColors[lastSentiment]?.replace('text-', 'bg-') || 'bg-primary-light'}`} />
            {lastSentiment === 'normal' ? 'Normal' : lastSentiment === 'attention' ? 'Atenção' : 'Crítico'}
          </span>
          <LogoutButton onLogout={logout} />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center mt-20">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-xl font-semibold text-white mb-2">Bem-vindo ao Totem IA</h2>
              <p className="text-gray-400 max-w-md mx-auto text-sm">Estou aqui para ajudar com seu onboarding. Pode me perguntar qualquer coisa!</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          </AnimatePresence>
          {chatLoading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="px-4 py-4 border-t border-surface-border bg-surface/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChatSend())}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-5 py-3.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-gray-500 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all duration-200"
          />
          <button onClick={() => handleChatSend()} disabled={chatLoading || !chatInput.trim()}
            className="px-6 py-3.5 rounded-xl bg-primary text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed glow-hover transition-all">
            Enviar
          </button>
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0B12]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚠️</div>
          <p className="text-gray-400">Backend offline. Faça login novamente mais tarde.</p>
          <button onClick={logout} className="mt-4 px-6 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm border border-red-500/30">
            Voltar ao login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="kiosk-container">
      <InstallPWA />
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <HubView
            key="home"
            authUser={authUser}
            user={user}
            alertCount={alertCount}
            onNavigate={navigate}
            onStartChat={openChat}
            onQuickAction={handleQuickAction}
            onToggleRolePicker={() => setShowRolePicker(!showRolePicker)}
            showRolePicker={showRolePicker}
            roles={ROLES}
            onSelectRole={handleSelectRole}
            onLogout={logout}
          />
        )}
        {view === 'chat' && <AnimatedPage key="chat">{renderChat()}</AnimatedPage>}
        {view === 'agenda' && <AgendaView key="agenda" onBack={() => navigate('home')} onLogout={logout} />}
        {view === 'progresso' && <ProgressoView key="progresso" user={user} onBack={() => navigate('home')} onLogout={logout} />}
        {view === 'resumo' && <ResumoView key="resumo" userId={user.id} onBack={() => navigate('home')} onLogout={logout} />}
        {view === 'alertas' && <AlertasView key="alertas" userId={user.id} onBack={() => navigate('home')} onLogout={logout} />}
        {view === 'configuracoes' && <ConfiguracoesView key="configuracoes" user={user} onBack={() => navigate('home')} onLogout={logout} />}
      </AnimatePresence>
    </div>
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
