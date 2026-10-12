import { useState } from 'react'
import { Download, Share, PlusSquare, Smartphone, Monitor, CheckCircle2, X } from 'lucide-react'
import { usePwaInstall } from '../hooks/usePwaInstall'

interface InstallPwaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstallPwaModal({ isOpen, onClose }: InstallPwaModalProps) {
  const { hasNativePrompt, isInstalled, isIos, promptInstall } = usePwaInstall()
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleInstallClick = async () => {
    const outcome = await promptInstall()
    if (outcome === 'accepted') {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0e6f5c] to-teal-500 flex items-center justify-center text-white shadow-lg shadow-[#0e6f5c]/25">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Instalar o StageFlow</h3>
            <p className="text-xs text-slate-400">Aplicativo Web Progressivo (PWA)</p>
          </div>
        </div>

        {isInstalled || success ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-emerald-400">
              Aplicativo instalado com sucesso!
            </p>
            <p className="text-xs text-slate-400">
              Você já pode acessar o StageFlow pelo ícone no seu celular ou área de trabalho.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Tenha o StageFlow na palma da mão com desempenho veloz, tela cheia e acesso rápido sem precisar abrir o navegador toda vez.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Android & iOS</span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
                <Monitor className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Windows & Mac</span>
              </div>
            </div>

            {isIos ? (
              <div className="p-3.5 bg-slate-950/80 border border-teal-500/30 rounded-xl space-y-2 text-xs">
                <p className="font-semibold text-teal-300 flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5" /> No iPhone / iPad (Safari):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>
                    Toque no botão <span className="font-bold text-white">Compartilhar</span> (ícone com quadrado e seta para cima).
                  </li>
                  <li>
                    Role as opções e toque em{' '}
                    <span className="font-bold text-white inline-flex items-center gap-1">
                      <PlusSquare className="w-3 h-3 text-teal-400" /> Adicionar à Tela de Início
                    </span>
                    .
                  </li>
                  <li>Toque em <span className="font-bold text-white">Adicionar</span> no topo direito.</li>
                </ol>
              </div>
            ) : hasNativePrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0e6f5c] hover:bg-[#128a73] text-white font-medium text-sm transition-all shadow-md shadow-[#0e6f5c]/25 active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                Instalar Aplicativo Agora
              </button>
            ) : (
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-teal-300">Como instalar no navegador:</p>
                <p>
                  No Chrome, Edge ou Brave, clique no ícone de computador/instalação na barra de endereço (topo direito) ou no menu de opções (três pontinhos) &gt; <strong className="text-white">"Instalar StageFlow"</strong>.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
