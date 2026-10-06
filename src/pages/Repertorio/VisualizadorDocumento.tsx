import { useState, useEffect, useRef } from 'react'
import {
  X,
  FileText,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Music,
} from 'lucide-react'

interface VisualizadorDocumentoProps {
  titulo: string
  artista?: string
  arquivoTipo: 'pdf' | 'docx' | 'txt'
  pdfUrl?: string
  textoConteudo?: string
  onClose: () => void
}

export function VisualizadorDocumento({
  titulo,
  artista,
  arquivoTipo,
  pdfUrl,
  textoConteudo,
  onClose,
}: VisualizadorDocumentoProps) {
  const [fontSize, setFontSize] = useState<number>(18)
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false)
  const [scrollSpeed, setScrollSpeed] = useState<number>(1) // 1, 2, 3
  const [semitons, setSemitons] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<number | null>(null)

  // Auto-scroll logic for live stage reading
  useEffect(() => {
    if (isAutoScrolling && contentRef.current) {
      const scrollStep = scrollSpeed * 1.5
      scrollIntervalRef.current = window.setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += scrollStep
          if (
            contentRef.current.scrollTop + contentRef.current.clientHeight >=
            contentRef.current.scrollHeight - 5
          ) {
            setIsAutoScrolling(false)
          }
        }
      }, 50)
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [isAutoScrolling, scrollSpeed])

  const handlePrint = () => {
    window.print()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top Bar with Document Info & Controls */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">{titulo}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-slate-800 text-teal-300 border border-teal-500/30">
                  {arquivoTipo.toUpperCase()}
                </span>
              </div>
              {artista && <p className="text-xs text-slate-400 truncate">{artista}</p>}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {arquivoTipo !== 'pdf' && (
              <>
                {/* Font Size Buttons */}
                <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
                  <button
                    onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                    className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                    title="Diminuir Fonte"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-slate-200">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize((s) => Math.min(36, s + 2))}
                    className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                    title="Aumentar Fonte"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Auto Scroll for Live Stage Performance */}
                <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
                  <button
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isAutoScrolling
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoScrolling ? 'Pausar' : 'Auto-Scroll'}</span>
                  </button>
                  {isAutoScrolling && (
                    <button
                      onClick={() => setScrollSpeed((v) => (v >= 3 ? 1 : v + 1))}
                      className="px-2 py-1 text-[11px] font-bold text-teal-300 hover:bg-slate-700 rounded-md ml-1"
                      title="Velocidade de rolagem"
                    >
                      {scrollSpeed}x
                    </button>
                  )}
                </div>

                {/* Tone / Transposition */}
                <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 pl-2 pr-1 flex items-center gap-1">
                    <Music className="w-3 h-3 text-indigo-400" /> Tom:
                  </span>
                  <button
                    onClick={() => setSemitons((s) => s - 1)}
                    className="px-2 py-1 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-700 font-bold"
                    title="Abaixar 1 semitom"
                  >
                    -1
                  </button>
                  <span className="text-xs font-mono font-bold px-1 text-indigo-300">
                    {semitons > 0 ? `+${semitons}` : semitons}
                  </span>
                  <button
                    onClick={() => setSemitons((s) => s + 1)}
                    className="px-2 py-1 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-700 font-bold"
                    title="Subir 1 semitom"
                  >
                    +1
                  </button>
                </div>
              </>
            )}

            {/* Print and Fullscreen */}
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700"
              title="Imprimir / Salvar PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700"
              title="Tela Cheia"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 transition-colors ml-1"
              title="Fechar Leitor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 text-slate-100">
          {arquivoTipo === 'pdf' ? (
            pdfUrl ? (
              <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col">
                <iframe
                  src={pdfUrl}
                  title={`Partitura ${titulo}`}
                  className="w-full flex-1 border-0 rounded-xl min-h-[600px]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                <FileText className="w-12 h-12 text-slate-600" />
                <p>Nenhum arquivo PDF carregado para visualização.</p>
              </div>
            )
          ) : (
            <div className="max-w-3xl mx-auto py-4">
              <div
                className="font-mono whitespace-pre-wrap leading-relaxed select-text"
                style={{ fontSize: `${fontSize}px` }}
              >
                {textoConteudo || (
                  <span className="text-slate-500 italic">
                    Nenhum conteúdo de texto encontrado neste documento.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>StageFlow Live Reader • Modo Palco & Cifras</span>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`${titulo}.${arquivoTipo}`}
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" /> Baixar Arquivo Original
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
