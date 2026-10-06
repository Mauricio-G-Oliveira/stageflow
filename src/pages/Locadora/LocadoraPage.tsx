import { useState, useEffect, type FormEvent } from 'react'
import {
  Volume2,
  Calendar,
  Package,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  DollarSign,
  Truck,
} from 'lucide-react'
import type {
  EquipamentoItem,
  NovoEquipamentoPayload,
  LocacaoEvento,
  NovaLocacaoPayload,
  CategoriaEquipamento,
  StatusLocacao,
  ItemLocado,
} from '../../types/locadora'
import { locadoraService } from '../../services/locadoraService'
import { VisualizadorContratoLocacao } from './VisualizadorContratoLocacao'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

const CATEGORIAS_LABELS: Record<CategoriaEquipamento, string> = {
  som_pa: 'Som P.A. & Subs',
  retorno_palco: 'Retornos de Palco',
  mesa_som: 'Mesas de Som',
  microfones: 'Microfones & Periféricos',
  iluminacao: 'Iluminação & Cênica',
  estrutura_box: 'Estruturas Box Truss',
  cabos_perifericos: 'Cabos & Conexões',
  gerador_energia: 'Energia & Nobreaks',
}

export function LocadoraPage() {
  const [activeTab, setActiveTab] = useState<'inventario' | 'agenda' | 'contratos'>('inventario')
  const [equipamentos, setEquipamentos] = useState<EquipamentoItem[]>([])
  const [locacoes, setLocacoes] = useState<LocacaoEvento[]>([])
  const [notification, setNotification] = useState<string | null>(null)

  // Contrato Viewer
  const [viewingContrato, setViewingContrato] = useState<LocacaoEvento | null>(null)

  // Modais
  const [isEquipamentoModalOpen, setIsEquipamentoModalOpen] = useState(false)
  const [isLocacaoModalOpen, setIsLocacaoModalOpen] = useState(false)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todos')

  // Form Equipamento
  const [eqCodigo, setEqCodigo] = useState('')
  const [eqNome, setEqNome] = useState('')
  const [eqCategoria, setEqCategoria] = useState<CategoriaEquipamento>('som_pa')
  const [eqMarcaModelo, setEqMarcaModelo] = useState('')
  const [eqQuantidade, setEqQuantidade] = useState<number>(2)
  const [eqValorDiaria, setEqValorDiaria] = useState<number>(150)
  const [eqEstado, setEqEstado] = useState<'excelente' | 'bom' | 'manutencao'>('excelente')
  const [eqObservacoes, setEqObservacoes] = useState('')

  // Form Locação
  const [locClienteNome, setLocClienteNome] = useState('')
  const [locClienteDocumento, setLocClienteDocumento] = useState('')
  const [locClienteTelefone, setLocClienteTelefone] = useState('')
  const [locClienteEmail, setLocClienteEmail] = useState('')
  const [locEventoNome, setLocEventoNome] = useState('')
  const [locLocalEvento, setLocLocalEvento] = useState('')
  const [locDataRetirada, setLocDataRetirada] = useState(new Date().toISOString().split('T')[0] + ' 14:00')
  const [locDataEvento, setLocDataEvento] = useState(new Date().toISOString().split('T')[0])
  const [locDataDevolucao, setLocDataDevolucao] = useState(new Date().toISOString().split('T')[0] + ' 10:00')
  const [locStatus, setLocStatus] = useState<StatusLocacao>('confirmada')
  const [locItens, setLocItens] = useState<ItemLocado[]>([])
  const [locIncluiOperador, setLocIncluiOperador] = useState(true)
  const [locValorOperador, setLocValorOperador] = useState(250)
  const [locIncluiFrete, setLocIncluiFrete] = useState(true)
  const [locValorFrete, setLocValorFrete] = useState(150)
  const [locDesconto, setLocDesconto] = useState(0)
  const [locValorSinal, setLocValorSinal] = useState(0)
  const [locFormaPagamento, setLocFormaPagamento] = useState('PIX (50% no fechamento e 50% na montagem)')
  const [locChavePix, setLocChavePix] = useState('mauriciogoulart.deoliveira37@gmail.com')
  const [locObservacoes, setLocObservacoes] = useState('')

  const loadData = async () => {
    const eqList = await locadoraService.listarEquipamentos()
    const locList = await locadoraService.listarLocacoes()
    setEquipamentos(eqList)
    setLocacoes(locList)
  }

  useEffect(() => {
    loadData()
  }, [])

  const notify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3500)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  // Handle Criar Equipamento
  const handleSaveEquipamento = async (e: FormEvent) => {
    e.preventDefault()
    if (!eqNome.trim() || !eqCodigo.trim()) {
      alert('Preencha o código de patrimônio e o nome do equipamento.')
      return
    }

    const payload: NovoEquipamentoPayload = {
      codigo: eqCodigo.trim().toUpperCase(),
      nome: eqNome.trim(),
      categoria: eqCategoria,
      marcaModelo: eqMarcaModelo.trim() || eqNome.trim(),
      quantidadeTotal: Number(eqQuantidade),
      quantidadeDisponivel: Number(eqQuantidade),
      valorDiaria: Number(eqValorDiaria),
      estado: eqEstado,
      observacoes: eqObservacoes.trim() || undefined,
    }

    await locadoraService.criarEquipamento(payload)
    await loadData()
    setIsEquipamentoModalOpen(false)
    notify(`Equipamento "${eqNome}" adicionado ao inventário!`)

    // Reset
    setEqCodigo('')
    setEqNome('')
    setEqMarcaModelo('')
    setEqQuantidade(2)
    setEqValorDiaria(150)
    setEqObservacoes('')
  }

  const handleDeleteEquipamento = async (id: string, nome: string) => {
    if (window.confirm(`Excluir "${nome}" do inventário da locadora?`)) {
      await locadoraService.excluirEquipamento(id)
      await loadData()
      notify(`Equipamento "${nome}" removido.`)
    }
  }

  // Handle Seleção de Equipamento na Locação
  const handleAddItemToLocacao = (eq: EquipamentoItem) => {
    const existing = locItens.find((item) => item.equipamentoId === eq.id)
    if (existing) {
      setLocItens((prev) =>
        prev.map((item) =>
          item.equipamentoId === eq.id
            ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * item.valorUnitario }
            : item,
        ),
      )
    } else {
      setLocItens((prev) => [
        ...prev,
        {
          equipamentoId: eq.id,
          nome: eq.nome,
          quantidade: 1,
          valorUnitario: eq.valorDiaria,
          subtotal: eq.valorDiaria,
        },
      ])
    }
  }

  const handleRemoveItemFromLocacao = (equipamentoId: string) => {
    setLocItens((prev) => prev.filter((item) => item.equipamentoId !== equipamentoId))
  }

  const subtotalEquipamentos = locItens.reduce((acc, curr) => acc + curr.subtotal, 0)
  const valorTotalLocacao = Math.max(
    0,
    subtotalEquipamentos +
      (locIncluiOperador ? Number(locValorOperador) : 0) +
      (locIncluiFrete ? Number(locValorFrete) : 0) -
      Number(locDesconto),
  )

  const handleOpenNovaLocacao = () => {
    setLocClienteNome('')
    setLocClienteDocumento('')
    setLocClienteTelefone('')
    setLocClienteEmail('')
    setLocEventoNome('')
    setLocLocalEvento('')
    setLocItens([])
    setLocIncluiOperador(true)
    setLocValorOperador(250)
    setLocIncluiFrete(true)
    setLocValorFrete(150)
    setLocDesconto(0)
    setLocValorSinal(0)
    setLocObservacoes('')
    setIsLocacaoModalOpen(true)
  }

  const handleSaveLocacao = async (e: FormEvent) => {
    e.preventDefault()
    if (!locClienteNome.trim() || !locEventoNome.trim()) {
      alert('Informe o nome do cliente e do evento.')
      return
    }
    if (locItens.length === 0) {
      alert('Selecione ao menos um equipamento do inventário para a locação.')
      return
    }

    const payload: NovaLocacaoPayload = {
      clienteNome: locClienteNome.trim(),
      clienteDocumento: locClienteDocumento.trim() || 'A informar',
      clienteTelefone: locClienteTelefone.trim() || 'A informar',
      clienteEmail: locClienteEmail.trim() || undefined,
      eventoNome: locEventoNome.trim(),
      localEvento: locLocalEvento.trim() || 'A definir',
      dataRetiradaEntrega: locDataRetirada,
      dataEvento: locDataEvento,
      dataDevolucao: locDataDevolucao,
      status: locStatus,
      itens: locItens,
      incluiOperadorSom: locIncluiOperador,
      valorOperadorSom: Number(locValorOperador),
      incluiTransporteFrete: locIncluiFrete,
      valorFrete: Number(locValorFrete),
      desconto: Number(locDesconto),
      valorTotal: valorTotalLocacao,
      valorSinal: Number(locValorSinal) || Math.round(valorTotalLocacao * 0.5),
      formaPagamento: locFormaPagamento,
      chavePix: locChavePix,
      observacoes: locObservacoes.trim() || undefined,
    }

    const created = await locadoraService.criarLocacao(payload)
    await loadData()
    setIsLocacaoModalOpen(false)
    notify(`Locação #${created.numeroContrato} registrada com sucesso!`)
  }

  const handleStatusChange = async (locId: string, status: StatusLocacao) => {
    await locadoraService.atualizarStatusLocacao(locId, status)
    await loadData()
    notify(`Status da locação atualizado para ${status.toUpperCase()}!`)
  }

  const handleDeleteLocacao = async (id: string, num: string) => {
    if (window.confirm(`Excluir a locação #${num}?`)) {
      await locadoraService.excluirLocacao(id)
      await loadData()
      notify(`Locação #${num} excluída.`)
    }
  }

  // Métricas
  const totalEquipamentosQtd = equipamentos.reduce((acc, curr) => acc + curr.quantidadeTotal, 0)
  const totalFaturamentoLocacoes = locacoes
    .filter((l) => l.status !== 'cancelada')
    .reduce((acc, curr) => acc + curr.valorTotal, 0)
  const locacoesAtivasCount = locacoes.filter((l) => l.status === 'confirmada' || l.status === 'em_andamento').length

  // Filtragem
  const filteredEquipamentos = equipamentos.filter((eq) => {
    const matchesSearch =
      eq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCat = selectedCategoria === 'todos' || eq.categoria === selectedCategoria
    return matchesSearch && matchesCat
  })

  // Se estiver visualizando contrato em folha A4
  if (viewingContrato) {
    return <VisualizadorContratoLocacao locacao={viewingContrato} onBack={() => setViewingContrato(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Volume2 className="w-6 h-6 text-[#0e6f5c]" />
            Locadora de Som & Equipamentos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão profissional para locadores de som, iluminação, caixas, mesas, contratos e agenda.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsEquipamentoModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-teal-400" />}
          >
            Novo Equipamento
          </Button>

          <Button
            variant="primary"
            onClick={handleOpenNovaLocacao}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Nova Locação
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-teal-400" /> Total no Inventário
          </span>
          <p className="text-2xl font-bold text-white mt-1">{totalEquipamentosQtd} itens</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Locações em Andamento
          </span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{locacoesAtivasCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Faturamento Previsto
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalFaturamentoLocacoes)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" /> Contratos Gerados
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{locacoes.length}</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('inventario')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'inventario'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          Inventário de Equipamentos ({equipamentos.length})
        </button>

        <button
          onClick={() => setActiveTab('agenda')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'agenda'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Agenda de Locações ({locacoes.length})
        </button>

        <button
          onClick={() => setActiveTab('contratos')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'contratos'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Contratos & Termos ({locacoes.length})
        </button>
      </div>

      {/* TAB 1: INVENTÁRIO */}
      {activeTab === 'inventario' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por código, nome ou modelo (ex: RCF, X32, Shure)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategoria('todos')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategoria === 'todos'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Todas Categorias
              </button>
              {(Object.keys(CATEGORIAS_LABELS) as CategoriaEquipamento[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoria(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategoria === cat
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {CATEGORIAS_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Equipamentos Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Cód. Patrimônio</th>
                    <th className="px-6 py-4">Equipamento / Modelo</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4 text-center">Qtd Total</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-right">Diária Unit.</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEquipamentos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        Nenhum equipamento cadastrado ou encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredEquipamentos.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-teal-400 text-xs">
                          {item.codigo}
                        </td>
                        <td className="px-6 py-4">
                          <strong className="text-white block font-medium">{item.nome}</strong>
                          <span className="text-xs text-slate-400">{item.marcaModelo}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            {CATEGORIAS_LABELS[item.categoria]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-white">
                          {item.quantidadeTotal}x
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                              item.estado === 'excelente'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : item.estado === 'bom'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-400">
                          {formatCurrency(item.valorDiaria)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteEquipamento(item.id, item.nome)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                            title="Excluir do inventário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGENDA DE LOCAÇÕES */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locacoes.map((loc) => (
              <div
                key={loc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      #{loc.numeroContrato}
                    </span>
                    <select
                      value={loc.status}
                      onChange={(e) => handleStatusChange(loc.id, e.target.value as StatusLocacao)}
                      className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200 font-semibold"
                    >
                      <option value="orcamento">Orçamento</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="devolvida">Devolvida</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{loc.eventoNome}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{loc.clienteNome}</p>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Data do Evento: <strong>{loc.dataEvento}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Entrega: {loc.dataRetiradaEntrega}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Devolução: {loc.dataDevolucao}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Equipamentos Locados ({loc.itens.length}):
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {loc.itens.map((it, idx) => (
                        <li key={idx} className="flex justify-between truncate">
                          <span className="truncate">{it.quantidade}x {it.nome}</span>
                          <span className="font-bold text-slate-400 ml-2">{formatCurrency(it.subtotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Valor Total</span>
                    <strong className="text-lg font-bold text-emerald-400">
                      {formatCurrency(loc.valorTotal)}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingContrato(loc)}
                      leftIcon={<FileText className="w-3.5 h-3.5" />}
                    >
                      Contrato
                    </Button>
                    <button
                      onClick={() => handleDeleteLocacao(loc.id, loc.numeroContrato)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTRATOS */}
      {activeTab === 'contratos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Contratos de Locação Gerados</h3>
            <p className="text-xs text-slate-400">
              Clique em qualquer contrato para visualizar em folha A4 oficial e imprimir ou salvar em PDF.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {locacoes.map((loc) => (
              <div key={loc.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      #{loc.numeroContrato}
                    </span>
                    <strong className="text-white text-sm">{loc.eventoNome}</strong>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Cliente: {loc.clienteNome} • Data: {loc.dataEvento} • Valor Total: {formatCurrency(loc.valorTotal)}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setViewingContrato(loc)}
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  Abrir Contrato A4
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Novo Equipamento */}
      {isEquipamentoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-400" /> Cadastrar Equipamento
              </h3>
              <button onClick={() => setIsEquipamentoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipamento} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Cód. Patrimônio *"
                  placeholder="Ex: PA-01, MIC-02"
                  value={eqCodigo}
                  onChange={(e) => setEqCodigo(e.target.value)}
                  required
                />
                <div className="col-span-2">
                  <Input
                    label="Nome do Equipamento *"
                    placeholder="Ex: Caixa Ativa RCF ART 715"
                    value={eqNome}
                    onChange={(e) => setEqNome(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Categoria *</label>
                  <select
                    value={eqCategoria}
                    onChange={(e) => setEqCategoria(e.target.value as CategoriaEquipamento)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    {(Object.keys(CATEGORIAS_LABELS) as CategoriaEquipamento[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORIAS_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Marca / Modelo"
                  placeholder="Ex: RCF / ART 715-A"
                  value={eqMarcaModelo}
                  onChange={(e) => setEqMarcaModelo(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Qtd em Estoque *"
                  type="number"
                  min="1"
                  value={eqQuantidade}
                  onChange={(e) => setEqQuantidade(Number(e.target.value))}
                  required
                />
                <Input
                  label="Valor da Diária (R$) *"
                  type="number"
                  min="0"
                  value={eqValorDiaria}
                  onChange={(e) => setEqValorDiaria(Number(e.target.value))}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Conservação</label>
                  <select
                    value={eqEstado}
                    onChange={(e) => setEqEstado(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="excelente">Excelente</option>
                    <option value="bom">Bom</option>
                    <option value="manutencao">Em Manutenção</option>
                  </select>
                </div>
              </div>

              <Input
                label="Observações / Cabos Inclusos"
                placeholder="Ex: Inclui capa protetora e cabo Powercon"
                value={eqObservacoes}
                onChange={(e) => setEqObservacoes(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsEquipamentoModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Equipamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nova Locação */}
      {isLocacaoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" /> Registrar Nova Locação & Gerar Contrato
              </h3>
              <button onClick={() => setIsLocacaoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLocacao} className="space-y-4 text-xs">
              {/* Cliente */}
              <div className="space-y-2">
                <strong className="text-slate-200 block text-xs font-semibold">1. Dados do Cliente / Contratante</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    label="Nome / Razão Social *"
                    placeholder="Ex: Espaço Jardim Eventos"
                    value={locClienteNome}
                    onChange={(e) => setLocClienteNome(e.target.value)}
                    required
                  />
                  <Input
                    label="CPF / CNPJ"
                    placeholder="Ex: 12.345.678/0001-90"
                    value={locClienteDocumento}
                    onChange={(e) => setLocClienteDocumento(e.target.value)}
                  />
                  <Input
                    label="WhatsApp / Telefone"
                    placeholder="(11) 98765-4321"
                    value={locClienteTelefone}
                    onChange={(e) => setLocClienteTelefone(e.target.value)}
                  />
                  <Input
                    label="E-mail"
                    placeholder="cliente@email.com"
                    value={locClienteEmail}
                    onChange={(e) => setLocClienteEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Evento & Datas */}
              <div className="space-y-2">
                <strong className="text-slate-200 block text-xs font-semibold">2. Evento & Logística</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    label="Nome do Evento *"
                    placeholder="Ex: Aniversário de 15 Anos"
                    value={locEventoNome}
                    onChange={(e) => setLocEventoNome(e.target.value)}
                    required
                  />
                  <Input
                    label="Local de Montagem"
                    placeholder="Ex: Rua das Flores, 100 - Salão Nobre"
                    value={locLocalEvento}
                    onChange={(e) => setLocLocalEvento(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="Entrega / Montagem"
                    value={locDataRetirada}
                    onChange={(e) => setLocDataRetirada(e.target.value)}
                  />
                  <Input
                    label="Data do Evento"
                    type="date"
                    value={locDataEvento}
                    onChange={(e) => setLocDataEvento(e.target.value)}
                  />
                  <Input
                    label="Devolução"
                    value={locDataDevolucao}
                    onChange={(e) => setLocDataDevolucao(e.target.value)}
                  />
                </div>
              </div>

              {/* Seleção de Equipamentos */}
              <div className="space-y-2">
                <strong className="text-slate-200 block text-xs font-semibold">3. Equipamentos Locados</strong>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {equipamentos.map((eq) => (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => handleAddItemToLocacao(eq)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-teal-500/20 hover:text-teal-300 border border-slate-800 text-[11px] text-slate-300 font-medium transition-colors"
                      >
                        + {eq.nome} ({formatCurrency(eq.valorDiaria)})
                      </button>
                    ))}
                  </div>

                  {locItens.length > 0 ? (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      {locItens.map((it) => (
                        <div key={it.equipamentoId} className="flex items-center justify-between text-xs text-white">
                          <span>{it.quantidade}x {it.nome}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-teal-400">{formatCurrency(it.subtotal)}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItemFromLocacao(it.equipamentoId)}
                              className="text-red-400 hover:text-red-300 p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">
                      Nenhum equipamento adicionado ainda. Clique nos botões acima para incluir.
                    </p>
                  )}
                </div>
              </div>

              {/* Serviços Opcionais & Financeiro */}
              <div className="space-y-2">
                <strong className="text-slate-200 block text-xs font-semibold">4. Serviços & Financeiro</strong>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locIncluiOperador}
                        onChange={(e) => setLocIncluiOperador(e.target.checked)}
                      />
                      <span>Técnico de Som</span>
                    </label>
                    {locIncluiOperador && (
                      <input
                        type="number"
                        value={locValorOperador}
                        onChange={(e) => setLocValorOperador(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white mt-1"
                        placeholder="R$ Valor"
                      />
                    )}
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locIncluiFrete}
                        onChange={(e) => setLocIncluiFrete(e.target.checked)}
                      />
                      <span>Frete / Transporte</span>
                    </label>
                    {locIncluiFrete && (
                      <input
                        type="number"
                        value={locValorFrete}
                        onChange={(e) => setLocValorFrete(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white mt-1"
                        placeholder="R$ Valor"
                      />
                    )}
                  </div>

                  <Input
                    label="Desconto (R$)"
                    type="number"
                    value={locDesconto}
                    onChange={(e) => setLocDesconto(Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Status Inicial</label>
                    <select
                      value={locStatus}
                      onChange={(e) => setLocStatus(e.target.value as StatusLocacao)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    >
                      <option value="confirmada">Confirmada</option>
                      <option value="orcamento">Orçamento</option>
                      <option value="em_andamento">Em Andamento</option>
                    </select>
                  </div>
                  <Input
                    label="Forma de Pagamento"
                    value={locFormaPagamento}
                    onChange={(e) => setLocFormaPagamento(e.target.value)}
                  />
                  <Input
                    label="Chave PIX para Depósito"
                    value={locChavePix}
                    onChange={(e) => setLocChavePix(e.target.value)}
                  />
                </div>

                <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-teal-300">Valor Total da Locação:</span>
                  <strong className="text-lg font-bold text-teal-400">
                    {formatCurrency(valorTotalLocacao)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsLocacaoModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Emitir Locação & Contrato
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
