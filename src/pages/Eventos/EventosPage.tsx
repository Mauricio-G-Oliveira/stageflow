import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  UserCheck,
  MapPin,
  Clock,
  FileText,
  Search,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import type { Evento } from '../../types/evento'
import { eventoService, type RelatorioFechador } from '../../services/eventoService'
import { contratoService } from '../../services/contratoService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function EventosPage() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [relatorioFechadores, setRelatorioFechadores] = useState<RelatorioFechador[]>([])
  const [viewMode, setViewMode] = useState<'lista' | 'prestacao_contas'>('lista')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'confirmado' | 'orcamento' | 'realizado'>('todos')

  const loadData = async () => {
    const list = await eventoService.listarTodos()
    const rel = await eventoService.obterRelatorioFechadores()
    setEventos(list)
    setRelatorioFechadores(rel)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`Excluir evento "${titulo}"?`)) {
      await eventoService.excluir(id)
      await loadData()
    }
  }

  const handleGerarContrato = async (evt: Evento) => {
    const payload = contratoService.gerarContratoDeEvento(evt, evt.tipoEvento === 'casamento' ? 'casamento' : 'festa_fechada')
    await contratoService.salvar(payload)
    navigate('/contratos')
  }

  const filteredEventos = eventos.filter((e) => {
    const matchesSearch =
      e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.localNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.fechadoPor?.nome && e.fechadoPor.nome.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'todos' || e.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalFaturamento = eventos.reduce((acc, curr) => acc + (curr.cacheTotal || 0), 0)
  const totalComissoes = eventos.reduce((acc, curr) => acc + (curr.fechadoPor?.comissaoValor || 0), 0)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-[#0e6f5c]" />
            Eventos, Shows & Fechamentos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Histórico completo de apresentações, cachês e prestação de contas de quem fechou cada show.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/agenda')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Novo Show na Agenda
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total de Shows</span>
          <p className="text-2xl font-bold text-white mt-1">{eventos.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Cachê Total Faturado</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {totalFaturamento.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Comissões de Captação</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            R$ {totalComissoes.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Integrantes Captadores</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {relatorioFechadores.length} músico(s)
          </p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setViewMode('lista')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'lista'
              ? 'bg-[#0e6f5c] text-white shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Lista de Shows & Contratos
        </button>
        <button
          onClick={() => setViewMode('prestacao_contas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'prestacao_contas'
              ? 'bg-[#0e6f5c] text-white shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Quem Fechou o Show (Histórico por Músico)
        </button>
      </div>

      {/* VIEW 1: LISTA DE SHOWS */}
      {viewMode === 'lista' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome do show, local, cidade ou quem fechou..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              {(['todos', 'confirmado', 'orcamento', 'realizado'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/60">
              {filteredEventos.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Nenhum evento encontrado com os filtros selecionados.
                </div>
              ) : (
                filteredEventos.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          {evt.tipoEvento.replace('_', ' ')}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                          {evt.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{evt.titulo}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-teal-400" />
                          {new Date(evt.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Show: {evt.horarioInicioShow} (Montagem: {evt.horarioMontagem})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {evt.localNome} • {evt.cidade}/{evt.estado}
                        </span>
                      </div>

                      {/* Closer info */}
                      <div className="pt-1 flex items-center gap-2 text-xs">
                        <span className="text-indigo-300 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          Fechado por: <strong>{evt.fechadoPor?.nome}</strong>
                        </span>
                        {evt.fechadoPor?.comissaoValor ? (
                          <span className="text-amber-400 text-[11px]">
                            • Comissão: R$ {evt.fechadoPor.comissaoValor.toLocaleString('pt-BR')}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-right sm:pr-4">
                        <span className="text-xs text-slate-400 block">Cachê Total</span>
                        <span className="text-base font-bold text-emerald-400 block">
                          R$ {evt.cacheTotal.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          R$ {evt.cachePorMusico}/músico
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGerarContrato(evt)}
                          leftIcon={<FileText className="w-3.5 h-3.5" />}
                          className="bg-teal-600 hover:bg-teal-700 text-xs"
                        >
                          Gerar Contrato
                        </Button>
                        <button
                          onClick={() => handleDelete(evt.id, evt.titulo)}
                          className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: QUEM FECHOU O SHOW - PRESTAÇÃO DE CONTAS POR MÚSICO */}
      {viewMode === 'prestacao_contas' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            💡 <strong>Transparência na Banda:</strong> Veja abaixo o volume de shows captados por cada integrante da banda, valores totais gerados e comissões devidas.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatorioFechadores.map((item) => (
              <div
                key={item.fechadorNome}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {item.fechadorNome.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{item.fechadorNome}</h3>
                      <span className="text-xs text-slate-400">
                        {item.quantidadeShows} show(s) fechado(s)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Total Captado
                    </span>
                    <strong className="text-emerald-400 text-base">
                      R$ {item.totalCacheBruto.toLocaleString('pt-BR')}
                    </strong>
                  </div>
                </div>

                {item.totalComissao > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex justify-between text-amber-300">
                    <span>Comissão total devida ao captador:</span>
                    <strong>R$ {item.totalComissao.toLocaleString('pt-BR')}</strong>
                  </div>
                )}

                {/* Shows closed by this musician */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">
                    Shows fechados por {item.fechadorNome}:
                  </span>
                  {item.shows.map((sh) => (
                    <div
                      key={sh.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-white block">{sh.titulo}</strong>
                        <span className="text-slate-400 text-[11px]">
                          {sh.localNome} ({sh.cidade}) •{' '}
                          {new Date(sh.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        R$ {sh.cacheTotal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
