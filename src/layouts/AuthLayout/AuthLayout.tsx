import { Outlet } from 'react-router-dom'
import { Logo } from '../../components/Logo/Logo'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0e6f5c]/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#161925]/80 blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo size="md" />
        <span className="text-xs font-medium text-slate-400 border border-slate-800 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full">
          Área de Acesso Seguro
        </span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-slate-500">
        StageFlow © {new Date().getFullYear()} • Plataforma de Gestão Musical
      </footer>
    </div>
  )
}
