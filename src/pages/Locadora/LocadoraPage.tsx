import { useState, useEffect, type FormEvent } from 'react'
import {
  Volume2,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  DollarSign,
  Calendar,
  CreditCard,
  UserCheck,
  Package,
  Layers,
  Sparkles,
  Printer,
  Sliders,
  Headphones,
  Mic,
  Lightbulb,
  Cable,
} from 'lucide-react'
import type {
  EquipamentoBanda,
  NovoEquipamentoBandaPayload,
  CategoriaEquipamentoBanda,
  EstadoEquipamento,
} from '../../types/equipamentoBanda'
import { equipamentoBandaService } from '../../services/equipamentoBandaService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

const CATEGORIAS_CONFIG: Record<
  CategoriaEquipamentoBanda,
  { label: string; icon: typeof Volume2; color: string }
> = {
  som_pa: { label: 'Som P.A. & Caixas', icon: Volume2, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  retorno_in_ear: { label: 'Retorno & In-Ear', icon: Headphones, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  mesa_som: { label: 'Mesa de Som & Processamento', icon: Sliders, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  microfones: { label: 'Microfones & Pedestais', icon: Mic, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  instrumentos_amps: { label: 'Instrumentos & Amplificadores', icon: Layers, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  iluminacao: { label: 'Iluminação & Palco', icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  cabos_cases: { label: 'Cabos & Hard Cases', icon: Cable, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  outros: { label: 'Outros Acessórios', icon: Package, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
}

const QUEM_PAGOU_SUGESTO = [
  'Caixa Geral da Banda',
  'Maurício G. Oliveira',
  'Divisão entre os 4 Músicos',
  'Vocalista',
  'Guitarrista',
  'Baterista',
]

const FORMA_COMPRA_SUGESTO = [
  'À vista via Pix',
  'Cartão de Crédito (10x sem juros)',
  'Cartão de Crédito (3x)',
  'Dinheiro do Caixa de Shows',
  'Transferência Bancária',
  'Entrada + Parcelas no Cartão',
]

export function LocadoraPage() {
  const [equipamentos, setEquipamentos] = useState<EquipamentoBanda[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todos')
  const [selectedQuemPagou, setSelectedQuemPagou] = useState<string>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Form State
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState<CategoriaEquipamentoBanda>('som_pa')
  const [marcaModelo, setMarcaModelo] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [valorPago, setValorPago] = useState(1500)
  const [dataCompra, setDataCompra] = useState(new Date().toISOString().split('T')[0])
  const [formaCompra, setFormaCompra] = useState('À vista via Pix')
  const [quemPagou, setQuemPagou] = useState('Caixa Geral da Banda')
  const [estado, setEstado] = useState<EstadoEquipamento>('excelente')
  const [localArmazenamento, setLocalArmazenamento] = useState('Van de Transporte')
  const [observacoes, setObservacoes] = useState('')

  const loadData = async () => {
    const list = await equipamentoBandaService.listarTodos()
    setEquipamentos(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Metricas
  const patrimonioTotal = equipamentos.reduce((acc, curr) => acc + (curr.valorPago || 0), 0)
  const totalUnidades = equipamentos.reduce((acc, curr) => acc + (curr.quantidade || 1), 0)

  const pagoPorCaixa = equipamentos
    .filter((e) => e.quemPagou.toLowerCase().includes('caixa'))
    .reduce((acc, curr) => acc + (curr.valorPago || 0), 0)

  const pagoPorIntegrantes = patrimonioTotal - pagoPorCaixa

  // Filtros
  const filteredEquipamentos = equipamentos.filter((item) => {
    const matchSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.marcaModelo && item.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.quemPagou.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formaCompra.toLowerCase().includes(searchTerm.toLowerCase())

    const matchCat = selectedCategoria === 'todos' || item.categoria === selectedCategoria
    const matchQuem = selectedQuemPagou === 'todos' || item.quemPagou === selectedQuemPagou

    return matchSearch && matchCat && matchQuem
  })

  const quemPagouOpcoes = Array.from(new Set(equipamentos.map((e) => e.quemPagou)))

  const handleOpenNewModal = () => {
    setEditingId(null)
    setNome('')
    setCategoria('som_pa')
    setMarcaModelo('')
    setQuantidade(1)
    setValorPago(1500)
    setDataCompra(new Date().toISOString().split('T')[0])
    setFormaCompra('À vista via Pix')
    setQuemPagou('Caixa Geral da Banda')
    setEstado('excelente')
    setLocalArmazenamento('Van de Transporte')
    setObservacoes('')
    setIsModalOpen(true)
  }

  const handleEdit = (eq: EquipamentoBanda) => {
    setEditingId(eq.id)
    setNome(eq.nome)
    setCategoria(eq.categoria)
    setMarcaModelo(eq.marcaModelo || '')
    setQuantidade(eq.quantidade || 1)
    setValorPago(eq.valorPago || 0)
    setDataCompra(eq.dataCompra || new Date().toISOString().split('T')[0])
    setFormaCompra(eq.formaCompra || 'À vista via Pix')
    setQuemPagou(eq.quemPagou || 'Caixa Geral da Banda')
    setEstado(eq.estado || 'excelente')
    setLocalArmazenamento(eq.localArmazenamento || '')
    setObservacoes(eq.observacoes || '')
    setIsModalOpen(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      alert('Preencha o nome do equipamento.')
      return
    }

    const payload: NovoEquipamentoBandaPayload = {
      nome: nome.trim(),
      categoria,
      marcaModelo: marcaModelo.trim() || undefined,
      quantidade,
      valorPago,
      dataCompra,
      formaCompra: formaCompra.trim(),
      quemPagou: quemPagou.trim(),
      estado,
      localArmazenamento: localArmazenamento.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
    }

    if (editingId) {
      await equipamentoBandaService.atualizar(editingId, payload)
      setNotification('Equipamento atualizado no inventário!')
    } else {
      await equipamentoBandaService.criar(payload)
      setNotification('Novo equipamento adicionado ao patrimônio da banda!')
    }

    await loadData()
    setIsModalOpen(false)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDelete = async (id: string, itemNome: string) => {
    if (confirm(`Remover "${itemNome}" do inventário da banda?`)) {
      await equipamentoBandaService.excluir(id)
      await loadData()
      setNotification(`"${itemNome}" foi removido do inventário.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-teal-400" />
              Inventário de Som & Equipamentos da Banda
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
              Patrimônio Próprio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Controle detalhado do som, iluminação e instrumentos: valores pagos, datas de compra, forma de pagamento e quem pagou.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Printer className="w-4 h-4 text-slate-300" />}
            onClick={handlePrint}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
          >
            Imprimir Inventário
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenNewModal}
          >
            + Adicionar Equipamento
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Patrimônio Total da Banda</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {patrimonioTotal.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{totalUnidades} unidades no total</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pago pelo Caixa Geral</span>
            <Package className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-teal-300 mt-2">
            R$ {pagoPorCaixa.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-teal-400/80 mt-0.5">Recursos gerados pelos shows</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pago por Integrantes</span>
            <UserCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-300 mt-2">
            R$ {pagoPorIntegrantes.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-indigo-400/80 mt-0.5">Investimento direto dos músicos</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Status dos Equipamentos</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">100% Operacional</p>
          <p className="text-[11px] text-emerald-400 mt-0.5">Pronto para shows e estrada</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, marca, quem pagou ou forma de compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
          >
            <option value="todos">Todas Categorias</option>
            {Object.entries(CATEGORIAS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          <select
            value={selectedQuemPagou}
            onChange={(e) => setSelectedQuemPagou(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
          >
            <option value="todos">Todos Pagadores</option>
            {quemPagouOpcoes.map((qp) => (
              <option key={qp} value={qp}>
                {qp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-3">
        {filteredEquipamentos.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
            <Volume2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Nenhum equipamento encontrado</p>
            <p className="text-xs text-slate-500 mt-1">
              Tente ajustar os filtros ou clique em "+ Adicionar Equipamento".
            </p>
          </div>
        ) : (
          filteredEquipamentos.map((item) => {
            const catConfig = CATEGORIAS_CONFIG[item.categoria] || CATEGORIAS_CONFIG.outros
            const Icon = catConfig.icon

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${catConfig.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{item.nome}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Qtd: {item.quantidade}x
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catConfig.color}`}>
                        {catConfig.label}
                      </span>
                    </div>

                    {item.marcaModelo && (
                      <p className="text-xs text-slate-400 font-mono">{item.marcaModelo}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        Comprado em:{' '}
                        <strong className="text-white">
                          {new Date(item.dataCompra + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </strong>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        Forma:{' '}
                        <strong className="text-slate-200">{item.formaCompra}</strong>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Quem pagou:{' '}
                        <span className="font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {item.quemPagou}
                        </span>
                      </span>

                      {item.localArmazenamento && (
                        <span className="text-[11px] text-slate-500">
                          Local: {item.localArmazenamento}
                        </span>
                      )}
                    </div>

                    {item.observacoes && (
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        Obs: {item.observacoes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-slate-400 block">Valor Pago</span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      R$ {item.valorPago.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Editar equipamento"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.nome)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remover equipamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal de Criação / Edição de Equipamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingId ? 'Editar Equipamento do Inventário' : 'Novo Equipamento da Banda'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Cadastre o equipamento com dados completos de compra, valores, formas de pagamento e responsável financeiro.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Nome do Equipamento"
                placeholder="Ex: Par de Caixas P.A. 15 RCF, Mesa XR18, Fones In-Ear..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Categoria do Som
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaEquipamentoBanda)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  >
                    {Object.entries(CATEGORIAS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Marca / Modelo"
                  placeholder="Ex: RCF ART 715-A, Shure Beta 58A..."
                  value={marcaModelo}
                  onChange={(e) => setMarcaModelo(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Valor Pago (R$)"
                  type="number"
                  placeholder="Ex: 3500"
                  value={valorPago}
                  onChange={(e) => setValorPago(Number(e.target.value))}
                  required
                />

                <Input
                  label="Data da Compra"
                  type="date"
                  value={dataCompra}
                  onChange={(e) => setDataCompra(e.target.value)}
                  required
                />

                <Input
                  label="Quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Como foi comprado? (Forma de Pagamento)
                </label>
                <input
                  type="text"
                  value={formaCompra}
                  onChange={(e) => setFormaCompra(e.target.value)}
                  placeholder="Ex: Cartão 10x sem juros, À vista no Pix, Dinheiro do cachê..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {FORMA_COMPRA_SUGESTO.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setFormaCompra(sug)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Quem pagou por este equipamento?
                </label>
                <input
                  type="text"
                  value={quemPagou}
                  onChange={(e) => setQuemPagou(e.target.value)}
                  placeholder="Ex: Caixa Geral da Banda, Maurício G. Oliveira, Divisão entre os 4..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUEM_PAGOU_SUGESTO.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setQuemPagou(sug)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Estado de Conservação
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoEquipamento)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  >
                    <option value="novo">Novo / Lacrado</option>
                    <option value="excelente">Excelente (Sem marcas)</option>
                    <option value="bom">Bom (Marcas normais de uso)</option>
                    <option value="manutencao">Necessita Manutenção / Revisão</option>
                  </select>
                </div>

                <Input
                  label="Onde fica guardado?"
                  placeholder="Ex: Van de Transporte, Hard Case, Casa Maurício..."
                  value={localArmazenamento}
                  onChange={(e) => setLocalArmazenamento(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Observações / Número de Série / Garantia
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Nota fiscal arquivada, garantia de fábrica até 2027..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <Button variant="primary" size="md" type="submit">
                  {editingId ? 'Salvar Alterações' : 'Salvar no Inventário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
