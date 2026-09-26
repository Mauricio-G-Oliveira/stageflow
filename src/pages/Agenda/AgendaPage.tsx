import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  FileText,
  DollarSign,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Trash2,
  X,
} from 'lucide-react'
import type { Evento, NovoEventoPayload, TipoEvento, StatusEvento, MusicoEscalado } from '../../types/evento'
import type { Musico } from '../../types/musico'
import { eventoService } from '../../services/eventoService'
import { musicoService } from '../../services/musicoService'
import { contratoService } from '../../services/contratoService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function AgendaPage() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [musicos, setMusicos] = useState<Musico[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [activeTab, setActiveTab] = useState<'geral' | 'horarios' | 'financeiro' | 'equipe'>('geral')
  const [notification, setNotification] = useState<string | null>(null)

  // Form State
  const [titulo, setTitulo] = useState('')
  const [tipoEvento, setTipoEvento] = useState<TipoEvento>('casamento')
  const [dataEvento, setDataEvento] = useState(selectedDate)
  const [status, setStatus] = useState<StatusEvento>('confirmado')

  // Horários de Palco
  const [horarioMontagem, setHorarioMontagem] = useState('16:00')
  const [horarioPassagemSom, setHorarioPassagemSom] = useState('18:00')
  const [horarioInicioShow, setHorarioInicioShow] = useState('22:00')
  const [tempoShowMinutos, setTempoShowMinutos] = useState(180)
  const [numeroSets, setNumeroSets] = useState(2)
  const [intervaloMinutos, setIntervaloMinutos] = useState(20)

  // Local & Logística
  const [localNome, setLocalNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [cidade, setCidade] = useState('São Paulo')
  const [estado, setEstado] = useState('SP')

  // Contratante
  const [contratanteNome, setContratanteNome] = useState('')
  const [contratanteTelefone, setContratanteTelefone] = useState('')
  const [contratanteEmail, setContratanteEmail] = useState('')
  const [contratanteDocumento, setContratanteDocumento] = useState('')

  // Quem Fechou o Show
  const [fechadoPorNome, setFechadoPorNome] = useState('Mauricio G. Oliveira')
  const [comissaoPorcentagem, setComissaoPorcentagem] = useState(10)

  // Financeiro
  const [cacheTotal, setCacheTotal] = useState(5000)
  const [valorSinal, setValorSinal] = useState(2500)
  const [dataVencimentoSinal, setDataVencimentoSinal] = useState('')
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'transferencia' | 'dinheiro'>('pix')
  const [chavePix, setChavePix] = useState('mauriciogoulart.deoliveira37@gmail.com')

  // Escalação de Músicos
  const [musicosEscalados, setMusicosEscalados] = useState<MusicoEscalado[]>([])
  const [equipamentos, setEquipamentos] = useState<string[]>([
    'Sistema de PA',
    'Retornos In-ear',
    'Mesa digital',
    'Microfones voz',
  ])
  const [observacoes, setObservacoes] = useState('')

  const loadAll = async () => {
    const evts = await eventoService.listarTodos()
    const mus = await musicoService.listarTodos()
    setEventos(evts)
    setMusicos(mus)
  }

  useEffect(() => {
    loadAll()
  }, [])

  // Auto calculate comissão and musician rateio
  const comissaoValor = Math.round((cacheTotal * comissaoPorcentagem) / 100)
  const cacheAposComissao = cacheTotal - comissaoValor
  const quantidadeIntegrantes = Math.max(1, musicosEscalados.length || 5)
  const cachePorMusicoCalculado = Math.round(cacheAposComissao / quantidadeIntegrantes)

  const handleOpenNewModal = (dateStr?: string) => {
    setEditingEvento(null)
    setTitulo('')
    setTipoEvento('casamento')
    setDataEvento(dateStr || selectedDate)
    setStatus('confirmado')
    setHorarioMontagem('16:00')
    setHorarioPassagemSom('18:00')
    setHorarioInicioShow('22:00')
    setTempoShowMinutos(180)
    setNumeroSets(2)
    setIntervaloMinutos(20)
    setLocalNome('')
    setEndereco('')
    setCidade('São Paulo')
    setEstado('SP')
    setContratanteNome('')
    setContratanteTelefone('')
    setContratanteEmail('')
    setContratanteDocumento('')
    setFechadoPorNome('Mauricio G. Oliveira')
    setComissaoPorcentagem(10)
    setCacheTotal(6000)
    setValorSinal(3000)
    setDataVencimentoSinal(dateStr || selectedDate)
    setObservacoes('')

    // Default 5 musicians
    const defaultScalada: MusicoEscalado[] = [
      { musicoId: '1', nome: 'Mauricio G. Oliveira', instrumento: 'Baixo / Voz', cache: 1080, confirmado: true },
      { musicoId: '2', nome: 'Vocalista', instrumento: 'Voz Principal', cache: 1080, confirmado: true },
      { musicoId: '3', nome: 'Guitarrista', instrumento: 'Guitarra', cache: 1080, confirmado: true },
      { musicoId: '4', nome: 'Tecladista', instrumento: 'Teclado', cache: 1080, confirmado: true },
      { musicoId: '5', nome: 'Baterista', instrumento: 'Bateria', cache: 1080, confirmado: true },
    ]
    setMusicosEscalados(defaultScalada)
    setActiveTab('geral')
    setIsModalOpen(true)
  }

  const handleEditModal = (evt: Evento) => {
    setEditingEvento(evt)
    setTitulo(evt.titulo)
    setTipoEvento(evt.tipoEvento)
    setDataEvento(evt.data)
    setStatus(evt.status)
    setHorarioMontagem(evt.horarioMontagem)
    setHorarioPassagemSom(evt.horarioPassagemSom)
    setHorarioInicioShow(evt.horarioInicioShow)
    setTempoShowMinutos(evt.tempoShowMinutos)
    setNumeroSets(evt.numeroSets)
    setIntervaloMinutos(evt.intervaloMinutos)
    setLocalNome(evt.localNome)
    setEndereco(evt.endereco)
    setCidade(evt.cidade)
    setEstado(evt.estado)
    setContratanteNome(evt.contratanteNome)
    setContratanteTelefone(evt.contratanteTelefone)
    setContratanteEmail(evt.contratanteEmail || '')
    setContratanteDocumento(evt.contratanteDocumento || '')
    setFechadoPorNome(evt.fechadoPor?.nome || 'Mauricio G. Oliveira')
    setComissaoPorcentagem(evt.fechadoPor?.comissaoPorcentagem ?? 10)
    setCacheTotal(evt.cacheTotal)
    setValorSinal(evt.valorSinal)
    setDataVencimentoSinal(evt.dataVencimentoSinal || evt.data)
    setMusicosEscalados(evt.musicosEscalados)
    setEquipamentos(evt.equipamentos || [])
    setObservacoes(evt.observacoes || '')
    setActiveTab('geral')
    setIsModalOpen(true)
  }

  const handleSaveEvento = async (e: FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !dataEvento || !localNome.trim() || !contratanteNome.trim()) {
      alert('Por favor, preencha o título do evento, data, local e nome do contratante.')
      return
    }

    const payload: NovoEventoPayload = {
      titulo: titulo.trim(),
      tipoEvento,
      data: dataEvento,
      status,
      horarioMontagem,
      horarioPassagemSom,
      horarioInicioShow,
      tempoShowMinutos,
      numeroSets,
      intervaloMinutos,
      localNome: localNome.trim(),
      endereco: endereco.trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      contratanteNome: contratanteNome.trim(),
      contratanteTelefone: contratanteTelefone.trim(),
      contratanteEmail: contratanteEmail.trim() || undefined,
      contratanteDocumento: contratanteDocumento.trim() || undefined,
      fechadoPor: {
        nome: fechadoPorNome.trim(),
        comissaoPorcentagem,
        comissaoValor,
      },
      cacheTotal,
      cachePorMusico: cachePorMusicoCalculado,
      valorSinal,
      dataVencimentoSinal,
      formaPagamento,
      chavePixPagamento: chavePix,
      musicosEscalados,
      equipamentos,
      observacoes,
    }

    if (editingEvento) {
      await eventoService.atualizar(editingEvento.id, payload)
      setNotification('Evento atualizado com sucesso!')
    } else {
      await eventoService.criar(payload)
      setNotification('Novo evento adicionado à agenda!')
    }

    await loadAll()
    setIsModalOpen(false)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDeleteEvento = async (id: string, nome: string) => {
    if (window.confirm(`Excluir o evento "${nome}" da agenda?`)) {
      await eventoService.excluir(id)
      await loadAll()
      setNotification(`Evento "${nome}" excluído.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleGerarContratoDireto = async (evt: Evento) => {
    const payload = contratoService.gerarContratoDeEvento(evt, evt.tipoEvento === 'casamento' ? 'casamento' : 'festa_fechada')
    await contratoService.salvar(payload)
    navigate('/contratos')
  }

  // Calendar calculations
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const calendarDays = []
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    calendarDays.push({
      day: d,
      dateString: dateFormatted,
      events: eventos.filter((e) => e.data === dateFormatted),
    })
  }

  // Filter events for selected date or show upcoming
  const eventsForSelectedDate = eventos.filter((e) => e.data === selectedDate)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-[#0e6f5c]" />
            Agenda & Cronograma de Shows
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Controle de datas, horários de passagem de som, montagem, cachês e quem fechou cada show.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => handleOpenNewModal(selectedDate)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Novo Evento
        </Button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Interactive Calendar on Left, Events of the Day on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {monthNames[month]} {year}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Hoje
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-1">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((item, index) => {
              if (!item) {
                return <div key={`empty-${index}`} className="h-20 rounded-xl bg-slate-950/20" />
              }

              const isSelected = item.dateString === selectedDate
              const isToday = item.dateString === new Date().toISOString().split('T')[0]
              const hasEvents = item.events.length > 0

              return (
                <div
                  key={item.dateString}
                  onClick={() => setSelectedDate(item.dateString)}
                  className={`h-20 p-1.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0e6f5c] bg-[#0e6f5c]/15 ring-2 ring-[#0e6f5c]/30'
                      : isToday
                      ? 'border-indigo-500/40 bg-slate-800/60'
                      : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-teal-300'
                          : isToday
                          ? 'text-indigo-400 font-extrabold'
                          : 'text-slate-300'
                      }`}
                    >
                      {item.day}
                    </span>
                    {hasEvents && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-0.5 overflow-hidden">
                    {item.events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[9px] font-medium truncate px-1 py-0.5 rounded bg-teal-600/30 text-teal-200 border border-teal-500/30"
                        title={ev.titulo}
                      >
                        {ev.horarioInicioShow} {ev.titulo}
                      </div>
                    ))}
                    {item.events.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-semibold block">
                        +{item.events.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Details / Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Eventos para o dia:</span>
                <h3 className="text-base font-bold text-white capitalize">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenNewModal(selectedDate)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Adicionar
              </Button>
            </div>

            {/* List for the selected day */}
            <div className="pt-4 space-y-3">
              {eventsForSelectedDate.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CalendarIcon className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-400">Nenhum show marcado para esta data.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenNewModal(selectedDate)}
                    className="text-teal-400 hover:text-teal-300 text-xs"
                  >
                    + Agendar show neste dia
                  </Button>
                </div>
              ) : (
                eventsForSelectedDate.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          {evt.tipoEvento.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{evt.titulo}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditModal(evt)}
                          className="p-1.5 text-slate-400 hover:text-white rounded"
                          title="Editar"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvento(evt.id, evt.titulo)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stage Timeline Badges */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Montagem</span>
                        <strong className="text-slate-200">{evt.horarioMontagem}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Passagem Som</span>
                        <strong className="text-slate-200">{evt.horarioPassagemSom}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Show</span>
                        <strong className="text-teal-400">{evt.horarioInicioShow}</strong>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {evt.localNome} • {evt.cidade}/{evt.estado}
                      </p>
                      <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        Cachê Total: R$ {evt.cacheTotal.toLocaleString('pt-BR')} (R$ {evt.cachePorMusico}/músico)
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Fechado por: <strong className="text-white">{evt.fechadoPor?.nome}</strong>
                        {evt.fechadoPor?.comissaoValor ? (
                          <span className="text-[10px] text-amber-300">
                            (Comissão: R$ {evt.fechadoPor.comissaoValor})
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {evt.musicosEscalados.length} músicos na formação
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleGerarContratoDireto(evt)}
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                        className="text-xs py-1.5 px-3 bg-teal-600 hover:bg-teal-700"
                      >
                        Gerar Contrato
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick summary footer */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Total de shows na agenda:</span>
            <strong className="text-white">{eventos.length} evento(s)</strong>
          </div>
        </div>
      </div>

      {/* MODAL: Criar / Editar Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-teal-400" />
                  {editingEvento ? 'Editar Evento da Agenda' : 'Cadastrar Novo Evento / Show'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure cronograma de palco, cachê, quem fechou e escalação dos 5+ músicos.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs in Modal */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              {[
                { id: 'geral', label: '1. Geral & Local' },
                { id: 'horarios', label: '2. Horários de Palco' },
                { id: 'financeiro', label: '3. Cachê & Quem Fechou' },
                { id: 'equipe', label: '4. Músicos & Rider' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveEvento} className="space-y-4">
              {/* TAB 1: GERAL & LOCAL */}
              {activeTab === 'geral' && (
                <div className="space-y-4 animate-in fade-in">
                  <Input
                    label="Nome / Título do Evento *"
                    placeholder="Ex: Casamento Fernanda & Pedro"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Tipo de Evento *
                      </label>
                      <select
                        value={tipoEvento}
                        onChange={(e) => setTipoEvento(e.target.value as TipoEvento)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                      >
                        <option value="casamento">Casamento</option>
                        <option value="festa_fechada">Festa Fechada</option>
                        <option value="aniversario">Aniversário</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="show_publico">Show Público / Festival</option>
                        <option value="bar_restaurante">Bar / Restaurante</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <Input
                      label="Data do Evento *"
                      type="date"
                      value={dataEvento}
                      onChange={(e) => setDataEvento(e.target.value)}
                      required
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Status do Evento
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as StatusEvento)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                      >
                        <option value="confirmado">Confirmado</option>
                        <option value="orcamento">Em Orçamento</option>
                        <option value="realizado">Realizado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Local / Espaço *"
                      placeholder="Ex: Buffet Torres / Sítio das Palmeiras"
                      value={localNome}
                      onChange={(e) => setLocalNome(e.target.value)}
                      required
                    />
                    <Input
                      label="Endereço Completo"
                      placeholder="Rua, Número, Bairro"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Cidade"
                      placeholder="Ex: São Paulo"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                    <Input
                      label="Estado (UF)"
                      placeholder="SP"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <Input
                      label="Nome do Contratante *"
                      placeholder="Nome do cliente responsável"
                      value={contratanteNome}
                      onChange={(e) => setContratanteNome(e.target.value)}
                      required
                    />
                    <Input
                      label="WhatsApp / Telefone Contratante"
                      placeholder="(11) 98765-4321"
                      value={contratanteTelefone}
                      onChange={(e) => setContratanteTelefone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: HORÁRIOS DE PALCO */}
              {activeTab === 'horarios' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-start gap-2">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Cronograma operacional indispensável para bandas de 5+ músicos: garanta que a passagem de som ocorra com antecedência.
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Horário Montagem (Setup) *"
                      type="time"
                      value={horarioMontagem}
                      onChange={(e) => setHorarioMontagem(e.target.value)}
                      required
                    />
                    <Input
                      label="Passagem de Som (Soundcheck) *"
                      type="time"
                      value={horarioPassagemSom}
                      onChange={(e) => setHorarioPassagemSom(e.target.value)}
                      required
                    />
                    <Input
                      label="Horário de Início do Show *"
                      type="time"
                      value={horarioInicioShow}
                      onChange={(e) => setHorarioInicioShow(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Duração Total (Minutos)"
                      type="number"
                      step="15"
                      value={tempoShowMinutos}
                      onChange={(e) => setTempoShowMinutos(Number(e.target.value))}
                    />
                    <Input
                      label="Número de Sets"
                      type="number"
                      min="1"
                      max="5"
                      value={numeroSets}
                      onChange={(e) => setNumeroSets(Number(e.target.value))}
                    />
                    <Input
                      label="Intervalo (Minutos)"
                      type="number"
                      step="5"
                      value={intervaloMinutos}
                      onChange={(e) => setIntervaloMinutos(Number(e.target.value))}
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Resumo do Tempo de Palco:</span>
                    <p className="text-white">
                      Show de <strong>{Math.floor(tempoShowMinutos / 60)}h{tempoShowMinutos % 60 ? (tempoShowMinutos % 60) + 'm' : ''}</strong> divididos em{' '}
                      <strong>{numeroSets} sets</strong> com intervalo de <strong>{intervaloMinutos} minutos</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCEIRO & QUEM FECHOU */}
              {activeTab === 'financeiro' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl bg-slate-950 border-2 border-indigo-500/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Quem fechou este show na banda?
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">
                          Integrante / Músico Responsável *
                        </label>
                        <select
                          value={fechadoPorNome}
                          onChange={(e) => setFechadoPorNome(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
                        >
                          <option value="Mauricio G. Oliveira">Mauricio G. Oliveira</option>
                          {musicos
                            .filter((m) => m.nome !== 'Mauricio G. Oliveira')
                            .map((m) => (
                              <option key={m.id} value={m.nome}>
                                {m.nome} ({m.instrumentoPrincipal})
                              </option>
                            ))}
                        </select>
                      </div>

                      <Input
                        label="% Comissão de Captação (Opcional)"
                        type="number"
                        min="0"
                        max="50"
                        value={comissaoPorcentagem}
                        onChange={(e) => setComissaoPorcentagem(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Cachê Total do Show (R$) *"
                      type="number"
                      step="100"
                      value={cacheTotal}
                      onChange={(e) => setCacheTotal(Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Valor do Sinal / Entrada (R$)"
                      type="number"
                      step="100"
                      value={valorSinal}
                      onChange={(e) => setValorSinal(Number(e.target.value))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Forma de Pagamento
                      </label>
                      <select
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value as 'pix' | 'transferencia' | 'dinheiro')}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                      >
                        <option value="pix">PIX</option>
                        <option value="transferencia">Transferência Bancária</option>
                        <option value="dinheiro">Dinheiro em Espécie</option>
                      </select>
                    </div>

                    <Input
                      label="Chave PIX da Banda"
                      placeholder="E-mail, CPF ou Telefone"
                      value={chavePix}
                      onChange={(e) => setChavePix(e.target.value)}
                    />
                  </div>

                  {/* Automatic Split Preview */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Cachê Bruto:</span>
                      <strong className="text-white">R$ {cacheTotal.toLocaleString('pt-BR')}</strong>
                    </div>
                    {comissaoPorcentagem > 0 && (
                      <div className="flex justify-between items-center text-amber-300">
                        <span>Comissão {fechadoPorNome} ({comissaoPorcentagem}%):</span>
                        <strong>- R$ {comissaoValor.toLocaleString('pt-BR')}</strong>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-teal-400 font-bold text-sm">
                      <span>Cachê por Músico ({quantidadeIntegrantes} integrantes):</span>
                      <span>R$ {cachePorMusicoCalculado.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MÚSICOS & RIDER */}
              {activeTab === 'equipe' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-2">
                      Músicos Escalados para este Evento ({musicosEscalados.length} integrantes):
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {musicosEscalados.map((item, idx) => (
                        <div
                          key={item.musicoId || idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{item.nome}</span>
                            <span className="text-slate-400 text-[11px]">{item.instrumento}</span>
                          </div>
                          <span className="font-mono text-emerald-400 font-semibold">
                            R$ {cachePorMusicoCalculado.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Rider de Equipamentos & Som Necessários
                    </label>
                    <textarea
                      value={equipamentos.join(', ')}
                      onChange={(e) => setEquipamentos(e.target.value.split(',').map((s) => s.trim()))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white"
                      rows={2}
                      placeholder="Ex: Sistema de PA, 5 Fones in-ear, Mesa de som, 3 Microfones sem fio"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Observações Especiais do Palco / Camarim
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white"
                      rows={2}
                      placeholder="Ex: Montagem antecipada, alimentação vegetariana para o baixista, voltagem 220v"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" type="submit">
                    {editingEvento ? 'Salvar Alterações' : 'Adicionar Evento'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
