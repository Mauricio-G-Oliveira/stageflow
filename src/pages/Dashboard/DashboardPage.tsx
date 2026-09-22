import { Link } from 'react-router-dom'
import {
  Calendar,
  Users2,
  Music2,
  Clock,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button/Button'

export function DashboardPage() {
  const { user, users } = useAuth()

  // Sample upcoming shows for mock dashboard
  const upcomingEvents = [
    {
      id: 'evt-1',
      title: 'Festival da Primavera 2026',
      date: '28 Set, 21:00',
      venue: 'Arena Show Bar - São Paulo, SP',
      band: 'Banda Blackout',
      cache: 'R$ 4.500',
      status: 'Confirmado',
    },
    {
      id: 'evt-2',
      title: 'Casamento Mariana & Rodrigo',
      date: '04 Out, 18:30',
      venue: 'Espaço Jardim das Flores - Campinas, SP',
      band: 'Acoustic Soul',
      cache: 'R$ 6.200',
      status: 'Contrato Assinado',
    },
    {
      id: 'evt-3',
      title: 'Noite do Rock & Blues',
      date: '12 Out, 22:00',
      venue: 'The Pub Station - Santos, SP',
      band: 'Banda Blackout',
      cache: 'R$ 3.800',
      status: 'Em Negociação',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0e6f5c] via-[#094d40] to-[#161925] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-200 border border-white/15">
              Painel Principal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Olá, {user?.name}! 👋
            </h1>
            <p className="text-sm text-teal-100/80 max-w-xl">
              Você está conectado como{' '}
              <strong className="text-white capitalize">
                {user?.role === 'admin' ? 'Administrador do StageFlow' : user?.role}
              </strong>
              . Aqui está o resumo das suas bandas, eventos e equipe.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === 'admin' && (
              <Link to="/usuarios">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<UserPlus className="w-4 h-4 text-teal-400" />}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md"
                >
                  Gerenciar Equipe ({users.length})
                </Button>
              </Link>
            )}
            <Link to="/eventos">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="bg-white text-[#0e6f5c] hover:bg-teal-50 font-bold shadow-lg"
              >
                Novo Evento
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Próximos Shows</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">3</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-teal-400 font-semibold">+1</span> agendado para o próximo mês
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Membros na Equipe</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{users.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {users.filter((u) => u.role === 'musico').length} músicos cadastrados
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Músicas no Repertório</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">48</p>
          <p className="text-xs text-slate-400 mt-1">Divididas em 3 setlists ativos</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Próximo Ensaio</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-white mt-3">Quinta, 19:30</p>
          <p className="text-xs text-slate-400 mt-1">Estúdio Som & Arte • Sala A</p>
        </div>
      </div>

      {/* Two columns: Upcoming Shows and Recent Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Shows */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Próximos Eventos & Shows</h2>
              <p className="text-xs text-slate-400">Acompanhe as datas e status dos contratos</p>
            </div>
            <Link
              to="/eventos"
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              Ver todos
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{event.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {event.band}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {event.venue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <span className="text-xs font-bold text-emerald-400">{event.cache}</span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Team Members Quick List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Membros da Equipe</h2>
              <p className="text-xs text-slate-400">Integrantes com acesso ao sistema</p>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/usuarios"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                Gerenciar
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {users.slice(0, 5).map((u) => {
              const initials = u.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0e6f5c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {u.instrument || (u.role === 'admin' ? 'Administrador' : 'Equipe')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {u.role}
                  </span>
                </div>
              )
            })}
          </div>

          {user?.role === 'admin' && (
            <Link to="/usuarios" className="block pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Adicionar Novo Usuário
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
