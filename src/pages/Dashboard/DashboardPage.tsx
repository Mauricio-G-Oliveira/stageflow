import { useState, useEffect } from 'react'
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
  FileText,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import type { Evento } from '../../types/evento'
import type { Musico } from '../../types/musico'
import type { Contrato } from '../../types/contrato'
import { eventoService } from '../../services/eventoService'
import { musicoService } from '../../services/musicoService'
import { repertorioService } from '../../services/repertorioService'
import { contratoService } from '../../services/contratoService'
import { Button } from '../../components/Button/Button'

export function DashboardPage() {
  const { user } = useAuth()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [musicos, setMusicos] = useState<Musico[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [totalMusicas, setTotalMusicas] = useState(0)

  useEffect(() => {
    const load = async () => {
      const evts = await eventoService.listarTodos()
      const mus = await musicoService.listarTodos()
      const songs = await repertorioService.listarTodas()
      const ctrs = await contratoService.listarTodos()
      setEventos(evts)
      setMusicos(mus)
      setTotalMusicas(songs.length)
      setContratos(ctrs)
    }
    load()
  }, [])

  const faturamentoTotal = eventos.reduce((acc, curr) => acc + (curr.cacheTotal || 0), 0)

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
              . Aqui está o resumo das suas bandas, eventos e equipe de 5+ músicos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/contratos">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<FileText className="w-4 h-4 text-teal-400" />}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md"
              >
                Emitir Contrato ({contratos.length})
              </Button>
            </Link>
            <Link to="/agenda">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="bg-white text-[#0e6f5c] hover:bg-teal-50 font-bold shadow-lg"
              >
                Novo Show na Agenda
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Shows & Eventos</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{eventos.length}</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            R$ {faturamentoTotal.toLocaleString('pt-BR')} faturados
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Integrantes da Banda</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{musicos.length}</p>
          <p className="text-xs text-slate-400 mt-1">Formação para 5+ músicos</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Repertório Musical</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{totalMusicas}</p>
          <p className="text-xs text-slate-400 mt-1">Músicas com tom e arranjo</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Contratos Emitidos</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{contratos.length}</p>
          <p className="text-xs text-slate-400 mt-1">Prontos para PDF / assinatura</p>
        </div>
      </div>

      {/* Two columns: Upcoming Shows and Recent Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Shows */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Próximos Eventos & Shows</h2>
              <p className="text-xs text-slate-400">Acompanhe horários de montagem, passagem de som e quem fechou</p>
            </div>
            <Link
              to="/agenda"
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              Abrir Agenda
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {eventos.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Nenhum evento agendado.</p>
            ) : (
              eventos.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{event.titulo}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 capitalize">
                        {event.tipoEvento.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {new Date(event.data + 'T00:00:00').toLocaleDateString('pt-BR')} • Show: {event.horarioInicioShow}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {event.localNome} ({event.cidade})
                      </span>
                    </div>
                    <div className="pt-1 text-[11px] text-indigo-300 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Fechado por: <strong>{event.fechadoPor?.nome}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 block">
                        R$ {event.cacheTotal.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        R$ {event.cachePorMusico}/músico
                      </span>
                    </div>
                    <Link to="/contratos">
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                        Contrato
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Band Members Quick List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Músicos da Banda</h2>
              <p className="text-xs text-slate-400">Formação 5+ integrantes</p>
            </div>
            <Link
              to="/musicos"
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              Ver todos
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {musicos.slice(0, 5).map((u) => {
              const initials = u.nome
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
                      <p className="text-xs font-semibold text-white">{u.nome}</p>
                      <p className="text-[11px] text-teal-400">{u.instrumentoPrincipal}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {u.tipoVinculo}
                  </span>
                </div>
              )
            })}
          </div>

          <Link to="/musicos" className="block pt-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Cadastrar Mais Integrantes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
