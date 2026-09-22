import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users2,
  Mic2,
  Music2,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../../components/Logo/Logo'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/agenda',
      label: 'Agenda',
      icon: CalendarDays,
    },
    {
      to: '/eventos',
      label: 'Eventos & Shows',
      icon: Calendar,
    },
    {
      to: '/bandas',
      label: 'Bandas',
      icon: Users2,
    },
    {
      to: '/musicos',
      label: 'Músicos',
      icon: Mic2,
    },
    {
      to: '/repertorio',
      label: 'Repertório',
      icon: Music2,
    },
    {
      to: '/usuarios',
      label: 'Usuários & Equipe',
      icon: UserCheck,
      adminOnly: true,
      badge: 'Admin',
    },
    {
      to: '/configuracoes',
      label: 'Configurações',
      icon: Settings,
    },
  ]

  const userInitials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'SF'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <Logo size="sm" />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0e6f5c] text-white shadow-sm shadow-[#0e6f5c]/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Card & Logout in Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0e6f5c] to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-teal-400 font-medium capitalize">
                  {user?.role === 'admin' ? 'Administrador' : user?.role}
                </span>
                {user?.role === 'admin' && (
                  <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Encerrar Sessão"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-900/40 border-b border-slate-800/80 backdrop-blur-md">
          <div>
            <h2 className="text-sm font-semibold text-slate-300">
              Painel de Gestão • StageFlow
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-semibold text-white block">{user?.name}</span>
              <span className="text-[11px] text-slate-400 block">{user?.email}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#0e6f5c] flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              {userInitials}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 py-1.5 px-3 rounded-lg border border-slate-800 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
