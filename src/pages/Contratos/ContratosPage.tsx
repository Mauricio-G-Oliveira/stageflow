import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import {
  FileText,
  Plus,
  Printer,
  Trash2,
  Upload,
  Calendar,
  Sparkles,
  Clock,
  Eye,
  CheckCircle2,
  PartyPopper,
  Briefcase,
  Building,
} from 'lucide-react'
import type { Contrato, ModeloContrato } from '../../types/contrato'
import type { Evento } from '../../types/evento'
import { contratoService } from '../../services/contratoService'
import { eventoService } from '../../services/eventoService'
import { Button } from '../../components/Button/Button'
import { VisualizadorContrato } from './VisualizadorContrato'

export function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [selectedModelo, setSelectedModelo] = useState<ModeloContrato>('casamento')
  const [selectedEventoId, setSelectedEventoId] = useState<string>('')
  const [notification, setNotification] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    const listContratos = await contratoService.listarTodos()
    const listEventos = await eventoService.listarTodos()
    setContratos(listContratos)
    setEventos(listEventos)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateContract = async () => {
    if (selectedEventoId) {
      const evento = eventos.find((e) => e.id === selectedEventoId)
      if (evento) {
        const payload = contratoService.gerarContratoDeEvento(evento, selectedModelo)
        const novo = await contratoService.salvar(payload)
        await loadData()
        setIsNewModalOpen(false)
        setSelectedContrato(novo)
        setNotification('Contrato gerado com sucesso a partir dos dados do evento!')
        setTimeout(() => setNotification(null), 4000)
        return
      }
    }

    // Default template without event
    const fakeEvento: Evento = {
      id: `evt-manual-${Date.now()}`,
      titulo: 'Apresentação Musical - Contrato Personalizado',
      tipoEvento: selectedModelo,
      data: new Date().toISOString().split('T')[0],
      status: 'confirmado',
      horarioMontagem: '16:00',
      horarioPassagemSom: '18:00',
      horarioInicioShow: '21:00',
      tempoShowMinutos: 180,
      numeroSets: 2,
      intervaloMinutos: 20,
      localNome: 'Nome do Espaço / Buffet',
      endereco: 'Rua Principal, 100',
      cidade: 'São Paulo',
      estado: 'SP',
      contratanteNome: 'Nome do Cliente / Contratante',
      contratanteTelefone: '(11) 99999-9999',
      contratanteEmail: 'cliente@exemplo.com',
      contratanteDocumento: '000.000.000-00',
      fechadoPor: { nome: 'Mauricio G. Oliveira' },
      cacheTotal: 5000,
      cachePorMusico: 1000,
      valorSinal: 2500,
      dataVencimentoSinal: new Date().toISOString().split('T')[0],
      formaPagamento: 'pix',
      chavePixPagamento: 'mauriciogoulart.deoliveira37@gmail.com',
      musicosEscalados: [
        { musicoId: '1', nome: 'Voz', instrumento: 'Voz', cache: 1000, confirmado: true },
        { musicoId: '2', nome: 'Guitarra', instrumento: 'Guitarra', cache: 1000, confirmado: true },
        { musicoId: '3', nome: 'Baixo', instrumento: 'Baixo', cache: 1000, confirmado: true },
        { musicoId: '4', nome: 'Teclado', instrumento: 'Teclado', cache: 1000, confirmado: true },
        { musicoId: '5', nome: 'Bateria', instrumento: 'Bateria', cache: 1000, confirmado: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const payload = contratoService.gerarContratoDeEvento(fakeEvento, selectedModelo)
    const novo = await contratoService.salvar(payload)
    await loadData()
    setIsNewModalOpen(false)
    setSelectedContrato(novo)
    setNotification('Novo modelo de contrato gerado com sucesso!')
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string, numero: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o contrato ${numero}?`)) {
      await contratoService.excluir(id)
      await loadData()
      if (selectedContrato?.id === id) {
        setSelectedContrato(null)
      }
      setNotification(`Contrato ${numero} excluído.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const jsonStr = event.target?.result as string
        const payload = contratoService.importarJSON(jsonStr)
        const saved = await contratoService.salvar(payload)
        await loadData()
        setSelectedContrato(saved)
        setNotification('Contrato importado com sucesso via JSON!')
        setTimeout(() => setNotification(null), 4000)
      } catch {
        alert('Arquivo JSON inválido ou incompatível com o formato de contrato.')
      }
    }
    reader.readAsText(file)
  }

  const modelosConfig: Record<ModeloContrato, { label: string; icon: typeof Sparkles; desc: string }> = {
    casamento: {
      label: 'Casamento',
      icon: Sparkles,
      desc: 'Cláusulas para cerimônia, recepção, alimentação, montagem antecipada e hora extra.',
    },
    festa_fechada: {
      label: 'Festa Fechada / Aniversário',
      icon: PartyPopper,
      desc: 'Cláusulas para segurança de palco, estrutura elétrica, bebidas e camarim.',
    },
    corporativo: {
      label: 'Corporativo / Convenção',
      icon: Briefcase,
      desc: 'Cláusulas para empresas, faturamento, rider técnico e pontualidade.',
    },
    geral: {
      label: 'Geral / Bares e Shows',
      icon: Building,
      desc: 'Contrato comercial padrão para apresentações musicais em geral.',
    },
  }

  // If a contract is currently opened for view/print, show the Visualizer
  if (selectedContrato) {
    return (
      <VisualizadorContrato
        contrato={selectedContrato}
        onVoltar={() => setSelectedContrato(null)}
        onSalvarEdicoes={async (atualizado) => {
          await contratoService.atualizar(atualizado.id, atualizado)
          await loadData()
          setSelectedContrato(atualizado)
          setNotification('Alterações salvas com sucesso!')
          setTimeout(() => setNotification(null), 3000)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#0e6f5c]" />
            Contratos de Apresentação Musical
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gere contratos jurídicos para casamentos, festas e eventos fechados com exportação e impressão em PDF.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Importar JSON
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsNewModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Novo Contrato
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Contract Templates Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['casamento', 'festa_fechada', 'corporativo', 'geral'] as ModeloContrato[]).map((mod) => {
          const cfg = modelosConfig[mod]
          const Icon = cfg.icon
          const count = contratos.filter((c) => c.modelo === mod).length

          return (
            <div
              key={mod}
              onClick={() => {
                setSelectedModelo(mod)
                setIsNewModalOpen(true)
              }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all shadow-lg group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500">{count} emitido(s)</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                {cfg.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cfg.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Contracts List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Contratos Cadastrados</h2>
            <p className="text-xs text-slate-400">Clique para visualizar, editar e imprimir em folha A4</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{contratos.length} contrato(s)</span>
        </div>

        {contratos.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">Nenhum contrato cadastrado ainda.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Crie seu primeiro contrato selecionando um dos modelos acima ou importando os dados diretamente de um evento da sua agenda.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Criar Contrato Agora
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {contratos.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-teal-400">
                      {item.numeroContrato}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                      {item.modelo.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {item.contratante.nome}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      • {item.detalhesShow.localNome} ({item.detalhesShow.cidadeShow})
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Data:{' '}
                      <strong className="text-slate-200">
                        {new Date(item.detalhesShow.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Show: {item.detalhesShow.horarioInicioShow}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      R$ {item.financeiro.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContrato(item)}
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    Visualizar & Imprimir
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedContrato(item)
                      setTimeout(() => window.print(), 300)
                    }}
                    leftIcon={<Printer className="w-4 h-4" />}
                  >
                    PDF
                  </Button>
                  <button
                    onClick={() => handleDelete(item.id, item.numeroContrato)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir Contrato"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Gerar Novo Contrato */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                Gerar Novo Contrato de Apresentação
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Escolha o modelo jurídico e vincule a um evento da sua agenda para preencher tudo automaticamente.
              </p>
            </div>

            <div className="space-y-4">
              {/* Modelo Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2">
                  1. Selecione o Modelo do Contrato:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['casamento', 'festa_fechada', 'corporativo', 'geral'] as ModeloContrato[]).map((m) => {
                    const cfg = modelosConfig[m]
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedModelo(m)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedModelo === m
                            ? 'border-teal-500 bg-teal-500/10 text-white shadow-sm'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="block text-xs font-bold text-white">{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Event Link Selection (Auto-fill) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2">
                  2. Importar Dados de um Evento da Agenda (Opcional):
                </label>
                <select
                  value={selectedEventoId}
                  onChange={(e) => setSelectedEventoId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Preencher modelo avulso (sem evento vinculado)</option>
                  {eventos.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.titulo} — {new Date(evt.data + 'T00:00:00').toLocaleDateString('pt-BR')} (R$ {evt.cacheTotal})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Selecione um evento para puxar datas, horários de montagem, passagem de som e cachê num clique.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleCreateContract}>
                  Gerar Contrato Agora
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
