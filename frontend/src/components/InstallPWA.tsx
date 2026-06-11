import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [swReady, setSwReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
    if (isStandalone) { setInstalled(true); return }

    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((apps: any[]) => {
        if (apps.some((a) => a.platform === 'webapp')) setInstalled(true)
      }).catch(() => {})
    }

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent) }
    const onInstalled = () => { setInstalled(true); setDeferredPrompt(null) }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setSwReady(true)).catch(() => {})
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') { setInstalled(true); setDismissed(true) }
    setDeferredPrompt(null)
  }

  if (installed || dismissed) return null
  if (!swReady) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#7C3AED]/30 bg-[#0B0B12]/95 backdrop-blur-md px-4 py-3 shadow-2xl shadow-black/50">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">Totem IA</span> — instale para acesso rápido
          {!deferredPrompt && <span className="hidden sm:inline text-gray-500 ml-2">(clique em <span className="inline-flex items-center gap-0.5 text-gray-400"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v12m0 0l-4-4m4 4l4-4m-8 6h8"/></svg>+</span> na barra de endereços)</span>}
        </p>
        <div className="flex items-center gap-2">
          {deferredPrompt ? (
            <button onClick={install} className="rounded-lg bg-[#7C3AED] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#6D28D9] transition-colors whitespace-nowrap">
              Instalar
            </button>
          ) : (
            <span className="text-[10px] text-gray-500 whitespace-nowrap">✓ Chrome</span>
          )}
          <button onClick={() => setDismissed(true)} className="text-gray-500 hover:text-gray-400 transition-colors p-1" title="Fechar">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
