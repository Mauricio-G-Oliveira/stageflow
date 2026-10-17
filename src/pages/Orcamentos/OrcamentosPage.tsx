import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileSpreadsheet,
  Plus,
  Search,
  MessageCircle,
  Eye,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  X,
  MapPin,
} from 'lucide-react'
import type { Orcamento, NovoOrcamentoPayload } from '../../types/orcamento'
import { orcamentoService, ITENS_INCLUSOS_PADRAO } from '../../services/orcamentoService'
import { bandaConfigService } from '../../services/bandaConfigService'
import { contratoService } from '../../services/contratoService'
import { VisualizadorOrcamento } from './VisualizadorOrcamento'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function OrcamentosPage() {
  const navigate = useNavigate()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('todos')
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Form State
  const [nomeCliente, setNomeCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [tipoEvento, setTipoEvento] = useState('Casamento / Recepção')
  const [localEvento, setLocalEvento] = useState('')
  const [cidade, setCidade] = useState('São Paulo - SP')
  const [dataEvento, setDataEvento] = useState(new Date().toISOString().split('T')[0])
  const [horarioInicio, setHorarioInicio] = useState('21:00')
  const [duracaoShow, setDuracaoShow] = useState('3 horas (2 sets de 1h20)')
  const [publicoEstimado, setPublicoEstimado] = useState('150 convidados')

  // Proposta State
  const [valorTotal, setValorTotal] = useState(5000)
  const [valorSinal, setValorSinal] = useState(2500)
  const [formaPagamento, setFormaPagamento] = useState(
    '50% de entrada para reserva de data via Pix + 50% até a passagem de som no dia do evento'
  )
  const [validadeDias, setValidadeDias] = useState(7)
  const [observacoes, setObservacoes] = useState(
    'Montagem dos equipamentos com 3 horas de antecedência. Repertório ajustado previamente com o cliente.'
  )

  const loadData = async () => {
    const list = await orcamentoService.listarTodos()
    setOrcamentos(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const bandaConfig = bandaConfigService.getConfig()

  const handleOpenNewModal = () => {
    setEditingId(null)
    setNomeCliente('')
    setTelefone('')
    setEmail('')
    setTipoEvento('Casamento / Recepção')
    setLocalEvento('')
    setCidade(bandaConfig.cidadeEstado)
    setDataEvento(new Date().toISOString().split('T')[0])
    setHorarioInicio('21:00')
    setDuracaoShow('3 horas (2 sets de 1h20)')
    setPublicoEstimado('150 convidados')
    setValorTotal(5000)
    setValorSinal(2500)
    setValidadeDias(7)
    setObservacoes(
      'Montagem dos equipamentos com 3 horas de antecedência. Repertório ajustado previamente com o cliente.'
    )
    setIsModalOpen(true)
  }

  const handleEdit = (orc: Orcamento) => {
    setEditingId(orc.id)
    setNomeCliente(orc.cliente.nome)
    setTelefone(orc.cliente.telefone)
    setEmail(orc.cliente.email || '')
    setTipoEvento(orc.cliente.tipoEvento)
    setLocalEvento(orc.cliente.localEvento)
    setCidade(orc.cliente.cidade)
    setDataEvento(orc.cliente.dataEvento)
    setHorarioInicio(orc.cliente.horarioInicio)
    setDuracaoShow(orc.cliente.duracaoShow)
    setPublicoEstimado(orc.cliente.publicoEstimado || '')
    setValorTotal(orc.proposta.valorTotal)
    setValorSinal(orc.proposta.valorSinal)
    setFormaPagamento(orc.proposta.formaPagamento)
    setValidadeDias(orc.validadeDias)
    setObservacoes(orc.proposta.observacoes || '')
    setIsModalOpen(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!nomeCliente.trim() || !telefone.trim() || !localEvento.trim()) {
      alert('Preencha o nome do cliente, telefone e local do evento.')
      return
    }

    const payload: NovoOrcamentoPayload = {
      status: 'pendente',
      dataEmissao: new Date().toISOString().split('T')[0],
      validadeDias,
      nomeBanda: bandaConfig.nomeBanda,
      cliente: {
        nome: nomeCliente.trim(),
        telefone: telefone.trim(),
        email: email.trim() || undefined,
        tipoEvento,
        localEvento: localEvento.trim(),
        cidade: cidade.trim(),
        dataEvento,
        horarioInicio,
        duracaoShow,
        publicoEstimado: publicoEstimado.trim() || undefined,
      },
      proposta: {
        formacaoBanda: bandaConfig.formacaoDescricao,
        itensInclusos: ITENS_INCLUSOS_PADRAO,
        valorTotal,
        valorSinal,
        valorRestante: valorTotal - valorSinal,
        formaPagamento,
        chavePix: bandaConfig.chavePix,
        beneficiarioPix: bandaConfig.responsavelNome,
        observacoes: observacoes.trim() || undefined,
      },
    }

    if (editingId) {
      await orcamentoService.atualizar(editingId, payload)
      setNotification('Orçamento atualizado com sucesso!')
    } else {
      await orcamentoService.criar(payload)
      setNotification('Novo orçamento gerado exclusivamente para o cliente!')
    }

    await loadData()
    setIsModalOpen(false)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDelete = async (id: string, clienteNome: string) => {
    if (confirm(`Excluir o orçamento de "${clienteNome}"?`)) {
      await orcamentoService.excluir(id)
      await loadData()
      setNotification('Orçamento removido.')
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleWhatsApp = (orc: Orcamento) => {
    const rawPhone = orc.cliente.telefone.replace(/\D/g, '')
    const phoneWithCountry = rawPhone.length <= 11 ? `55${rawPhone}` : rawPhone
    const text = encodeURIComponent(orcamentoService.gerarTextoWhatsApp(orc))
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank')
  }

  const handleConvertToContract = async (orc: Orcamento) => {
    // Generate official contract based on quote
    await contratoService.salvar({
      numeroContrato: `CTR-${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
      modelo: 'geral',
      status: 'rascunho',
      contratante: {
        nome: orc.cliente.nome,
        cpfCnpj: '000.000.000-00',
        telefone: orc.cliente.telefone,
        email: orc.cliente.email || '',
        enderecoCompleto: `${orc.cliente.localEvento}, ${orc.cliente.cidade}`,
        cidade: orc.cliente.cidade,
        estado: 'SP',
      },
      contratado: {
        nomeBanda: orc.nomeBanda,
        representanteNome: bandaConfig.responsavelNome,
        cpfRepresentante: bandaConfig.responsavelCpf,
        telefone: bandaConfig.responsavelTelefone,
        email: bandaConfig.responsavelEmail,
        chavePix: orc.proposta.chavePix,
      },
      detalhesShow: {
        data: orc.cliente.dataEvento,
        localNome: orc.cliente.localEvento,
        enderecoShow: `${orc.cliente.localEvento}, ${orc.cliente.cidade}`,
        cidadeShow: orc.cliente.cidade,
        horarioChegadaMontagem: '18:00',
        horarioPassagemSom: '19:30',
        horarioInicioShow: orc.cliente.horarioInicio,
        duracaoShow: orc.cliente.duracaoShow,
        formacaoBanda: orc.proposta.formacaoBanda,
      },
      financeiro: {
        valorTotal: orc.proposta.valorTotal,
        valorSinal: orc.proposta.valorSinal,
        dataVencimentoSinal: orc.dataEmissao,
        valorRestante: orc.proposta.valorRestante,
        dataVencimentoRestante: orc.cliente.dataEvento,
        formaPagamento: orc.proposta.formaPagamento,
        chavePix: orc.proposta.chavePix,
        beneficiarioPix: orc.proposta.beneficiarioPix,
      },
      clausulas: [],
    })

    await orcamentoService.atualizarStatus(orc.id, 'convertido_contrato')
    await loadData()
    setNotification('Proposta convertida com sucesso em Contrato!')
    setTimeout(() => {
      navigate('/contratos')
    }, 1500)
  }

  // Se estiver visualizando uma proposta
  if (selectedOrcamento) {
    return (
      <VisualizadorOrcamento
        orcamento={selectedOrcamento}
        onBack={() => setSelectedOrcamento(null)}
      />
    )
  }

  // Métricas
  const totalValor = orcamentos.reduce((acc, curr) => acc + (curr.proposta.valorTotal || 0), 0)
  const pendentesCount = orcamentos.filter((o) => o.status === 'pendente').length
  const aprovadosCount = orcamentos.filter(
    (o) => o.status === 'aprovado' || o.status === 'convertido_contrato'
  ).length

  const filteredOrcamentos = orcamentos.filter((orc) => {
    const matchSearch =
      orc.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.cliente.localEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.numeroOrcamento.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus = selectedStatus === 'todos' || orc.status === selectedStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-teal-400" />
              Orçamentos & Propostas Comerciais
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
              Exclusivo da Banda
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Cadastre o cliente e gere propostas exclusivas com valores, datas, itens inclusos e envie direto no WhatsApp.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenNewModal}
        >
          + Novo Orçamento para Cliente
        </Button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total de Propostas</span>
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{orcamentos.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Emitidas para clientes</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Em Negociação</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{pendentesCount}</p>
          <p className="text-[11px] text-amber-300/80 mt-0.5">Aguardando resposta do cliente</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Propostas Fechadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{aprovadosCount}</p>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">Convertidas em shows</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Valor em Propostas</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {totalValor.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Volume total orçado</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, local ou número do orçamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente / Em Negociação</option>
            <option value="aprovado">Aprovado</option>
            <option value="convertido_contrato">Convertido em Contrato</option>
            <option value="recusado">Recusado</option>
          </select>
        </div>
      </div>

      {/* Quote Cards */}
      <div className="space-y-3">
        {filteredOrcamentos.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
            <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Nenhum orçamento encontrado</p>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre um novo orçamento para gerar a primeira proposta para o seu cliente!
            </p>
          </div>
        ) : (
          filteredOrcamentos.map((orc) => {
            const dataEventoFormatada = new Date(
              orc.cliente.dataEvento + 'T00:00:00'
            ).toLocaleDateString('pt-BR')

            return (
              <div
                key={orc.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      {orc.numeroOrcamento}
                    </span>
                    <h3 className="text-base font-bold text-white">{orc.cliente.nome}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {orc.cliente.tipoEvento}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        orc.status === 'convertido_contrato'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                          : orc.status === 'aprovado'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {orc.status === 'convertido_contrato'
                        ? 'Contrato Gerado'
                        : orc.status === 'aprovado'
                        ? 'Aprovado'
                        : 'Em Negociação'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Data: <strong>{dataEventoFormatada}</strong> ({orc.cliente.horarioInicio})
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {orc.cliente.localEvento} ({orc.cliente.cidade})
                    </span>

                    <span className="text-slate-400">WhatsApp: {orc.cliente.telefone}</span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Formação: {orc.proposta.formacaoBanda} • Sinal: R${' '}
                    {orc.proposta.valorSinal.toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-slate-400 block">Investimento Total</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      R$ {orc.proposta.valorTotal.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleWhatsApp(orc)}
                      leftIcon={<MessageCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs"
                      title="Enviar proposta pronta no WhatsApp"
                    >
                      WhatsApp
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedOrcamento(orc)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="text-xs"
                    >
                      Ver Proposta
                    </Button>

                    {orc.status !== 'convertido_contrato' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleConvertToContract(orc)}
                        leftIcon={<FileText className="w-3.5 h-3.5 text-purple-400" />}
                        className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs"
                        title="Gerar contrato a partir desta proposta"
                      >
                        Gerar Contrato
                      </Button>
                    )}

                    <button
                      onClick={() => handleEdit(orc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(orc.id, orc.cliente.nome)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Excluir"
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

      {/* Modal de Criação / Edição de Orçamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingId ? 'Editar Orçamento' : 'Novo Orçamento Exclusivo para Cliente'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Preencha os dados do cliente, data do show, horários e valores. A proposta será gerada com o nome da banda ({bandaConfig.nomeBanda}).
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Nome do Cliente / Noivos / Contratante"
                  placeholder="Ex: Mariana & Lucas"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  required
                />

                <Input
                  label="WhatsApp / Telefone do Cliente"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tipo de Evento
                  </label>
                  <select
                    value={tipoEvento}
                    onChange={(e) => setTipoEvento(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  >
                    <option value="Casamento / Recepção">Casamento / Recepção</option>
                    <option value="Festa de Aniversário / 15 Anos">Festa de Aniversário / 15 Anos</option>
                    <option value="Evento Corporativo / Empresa">Evento Corporativo / Empresa</option>
                    <option value="Festa Fechada / Confraternização">Festa Fechada / Confraternização</option>
                    <option value="Formatura / Baile">Formatura / Baile</option>
                    <option value="Bar / Restaurante / Pub">Bar / Restaurante / Pub</option>
                    <option value="Festival / Evento Aberto">Festival / Evento Aberto</option>
                  </select>
                </div>

                <Input
                  label="E-mail (opcional)"
                  placeholder="cliente@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Local do Show / Buffet"
                  placeholder="Ex: Buffet Villa Bisutti, Chácara Recanto..."
                  value={localEvento}
                  onChange={(e) => setLocalEvento(e.target.value)}
                  required
                />

                <Input
                  label="Cidade - Estado"
                  placeholder="Ex: São Paulo - SP"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Data do Show / Evento"
                  type="date"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  required
                />

                <Input
                  label="Horário Previsto de Início"
                  placeholder="Ex: 21:00"
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  required
                />

                <Input
                  label="Duração do Show"
                  placeholder="Ex: 3 horas (2 sets)"
                  value={duracaoShow}
                  onChange={(e) => setDuracaoShow(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-3">
                <Input
                  label="Valor Total do Cachê (R$)"
                  type="number"
                  value={valorTotal}
                  onChange={(e) => {
                    const total = Number(e.target.value)
                    setValorTotal(total)
                    setValorSinal(Math.round(total / 2))
                  }}
                  required
                />

                <Input
                  label="Sinal para Reserva (R$)"
                  type="number"
                  value={valorSinal}
                  onChange={(e) => setValorSinal(Number(e.target.value))}
                  required
                />

                <Input
                  label="Validade da Proposta (Dias)"
                  type="number"
                  value={validadeDias}
                  onChange={(e) => setValidadeDias(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Condições de Pagamento
                </label>
                <input
                  type="text"
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Observações Extras na Proposta
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
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
                  {editingId ? 'Salvar Alterações' : 'Gerar Orçamento Exclusivo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
