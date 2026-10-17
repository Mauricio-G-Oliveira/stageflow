import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  MapPin,
  FileText,
  FileSpreadsheet,
  Volume2,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import type { Evento } from '../../types/evento'
import type { Musico } from '../../types/musico'
import type { Orcamento } from '../../types/orcamento'
import type { EquipamentoBanda } from '../../types/equipamentoBanda'
import { eventoService } from '../../services/eventoService'
import { musicoService } from '../../services/musicoService'
import { orcamentoService } from '../../services/orcamentoService'
import { equipamentoBandaService } from '../../services/equipamentoBandaService'
import { bandaConfigService } from '../../services/bandaConfigService'
import { Button } from '../../components/Button/Button'

export function DashboardPage() {
  const { user } = useAuth()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [musicos, setMusicos] = useState<Musico[]>([])
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [equipamentos, setEquipamentos] = useState<EquipamentoBanda[]>([])

  const bandaConfig = bandaConfigService.getConfig()

  useEffect(() => {
    const load = async () => {
      const evts = await eventoService.listarTodos()
      const mus = await musicoService.listarTodos()
      const orcs = await orcamentoService.listarTodos()
      const eqs = await equipamentoBandaService.listarTodos()
      setEventos(evts)
      setMusicos(mus)
      setOrcamentos(orcs)
      setEquipamentos(eqs)
    }
    load()
  }, [])


  const faturamentoTotal = eventos.reduce((acc, curr) => acc + (curr.cacheTotal || 0), 0)
  const patrimonioSom = equipamentos.reduce((acc, curr) => acc + (curr.valorPago || 0), 0)
  const musicosPalco = musicos.filter((m) => m.categoria === 'musico').length
  const equipeTecnica = musicos.filter((m) => m.categoria === 'tecnico').length

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0e6f5c] via-[#094d40] to-[#161925] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-200 border border-white/15">
              Painel Exclusivo da Banda
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {bandaConfig.nomeBanda}
            </h1>
            <p className="text-sm text-teal-100/90 max-w-xl">
              Bem-vindo, <strong>{user?.name}</strong>! Este painel é dedicado exclusivamente para gerenciar os shows, orçamentos para clientes, repertório, equipe (4 músicos + roadie) e inventário de som da sua banda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/presskit">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4 text-teal-300" />}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md"
              >
                Press Kit
              </Button>
            </Link>

            <Link to="/orcamentos">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<FileSpreadsheet className="w-4 h-4 text-teal-300" />}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md"
              >
                + Novo Orçamento
              </Button>
            </Link>

            <Link to="/agenda">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="bg-white text-[#0e6f5c] hover:bg-teal-50 font-bold shadow-lg"
              >
                Novo Show
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
            R$ {faturamentoTotal.toLocaleString('pt-BR')} em cachês
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Músicos & Equipe</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{musicos.length} pessoas</p>
          <p className="text-xs text-indigo-300 mt-1 font-medium">
            {musicosPalco} músicos no palco + {equipeTecnica} roadie
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Orçamentos p/ Clientes</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{orcamentos.length}</p>
          <p className="text-xs text-cyan-300 mt-1 font-medium">Propostas comerciais com WhatsApp</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Patrimônio de Som da Banda</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-3 font-mono">
            R$ {patrimonioSom.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {equipamentos.length} itens registrados no inventário
          </p>
        </div>
      </div>

      {/* Two columns: Upcoming Shows and Recent Quotes / Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Shows */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Próximos Shows da Banda</h2>
              <p className="text-xs text-slate-400">
                Horários de montagem do som, passagem e início da apresentação
              </p>
            </div>
            <Link
              to="/agenda"
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              Abrir Agenda Completa
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {eventos.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Nenhum evento agendado.</p>
            ) : (
              eventos.slice(0, 4).map((event) => (
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
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 block">
                        R$ {event.cacheTotal.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {event.status === 'confirmado' ? 'Confirmado' : 'Em negociação'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Links & Team Overview */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Ações Rápidas da Banda</h3>

            <div className="space-y-2">
              <Link
                to="/orcamentos"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 block">
                      Gerar Orçamento p/ Cliente
                    </span>
                    <span className="text-[10px] text-slate-400">Valores, datas e WhatsApp</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>

              <Link
                to="/presskit"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 block">
                      Press Kit Oficial
                    </span>
                    <span className="text-[10px] text-slate-400">Bio, rider técnico e mapa</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>

              <Link
                to="/equipamentos"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                      Inventário de Som da Banda
                    </span>
                    <span className="text-[10px] text-slate-400">Valores pagos e quem pagou</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>

              <Link
                to="/contratos"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-violet-300 block">
                      Contratos de Show
                    </span>
                    <span className="text-[10px] text-slate-400">Modelo personalizável</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Team Snapshot */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Equipe da Banda</h3>
              <Link to="/musicos" className="text-xs text-teal-400 hover:underline">
                Gerenciar
              </Link>
            </div>

            <div className="space-y-2">
              {musicos.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        m.categoria === 'musico'
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {m.categoria === 'musico' ? 'M' : 'T'}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{m.nome}</span>
                      <span className="text-[10px] text-slate-400">{m.instrumentoPrincipal}</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px] font-bold">
                    R$ {(m.cachePadrao || 0).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
