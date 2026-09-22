import { Calendar, Music2, Users, Flame, ArrowRight } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              StageFlow
            </h1>
            <p className="text-xs text-slate-400">Gestão de Bandas e Shows</p>
          </div>
        </div>

        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors shadow-sm">
          Entrar
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
            ⚡ Setup inicial concluído com sucesso
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Controle total do palco e da sua agenda
          </h2>
          <p className="text-slate-400 text-lg">
            O StageFlow centraliza repertório, escalação de músicos, cachês e eventos em uma interface moderna e rápida.
          </p>
        </div>

        {/* Feature Cards Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Agenda & Eventos</h3>
            <p className="text-sm text-slate-400 mt-1">
              Controle datas, horários de passagem de som e status de confirmação dos shows.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Bandas & Músicos</h3>
            <p className="text-sm text-slate-400 mt-1">
              Gerencie formação da equipe, instrumentos, cachês e contatos de substitutos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Music2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Repertório & Setlist</h3>
            <p className="text-sm text-slate-400 mt-1">
              Monte setlists com tom, ordem de execução e links de cifras em tempo real.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-lg shadow-violet-500/25 transition-all">
            Próximo passo: Configurar Rotas e Layout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        StageFlow © 2026 • Desenvolvido por Mauricio G. Oliveira
      </footer>
    </div>
  )
}
