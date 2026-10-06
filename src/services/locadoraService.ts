import type {
  EquipamentoItem,
  NovoEquipamentoPayload,
  LocacaoEvento,
  NovaLocacaoPayload,
} from '../types/locadora'

const STORAGE_EQUIPAMENTOS_KEY = 'stageflow_locadora_equipamentos_v1'
const STORAGE_LOCACOES_KEY = 'stageflow_locadora_locacoes_v1'

const DEFAULT_EQUIPAMENTOS: EquipamentoItem[] = [
  {
    id: 'eqp-1',
    codigo: 'PA-01',
    nome: 'Caixa Ativa RCF ART 715-A (15" 1400W)',
    categoria: 'som_pa',
    marcaModelo: 'RCF / ART 715 MK4',
    quantidadeTotal: 4,
    quantidadeDisponivel: 4,
    valorDiaria: 180,
    estado: 'excelente',
    observacoes: 'Acompanha cabo Powercon e capa de transporte',
  },
  {
    id: 'eqp-2',
    codigo: 'SUB-01',
    nome: 'Subwoofer Ativo 18" JBL SRX818SP (1000W RMS)',
    categoria: 'som_pa',
    marcaModelo: 'JBL / SRX818SP',
    quantidadeTotal: 2,
    quantidadeDisponivel: 2,
    valorDiaria: 250,
    estado: 'excelente',
    observacoes: 'Potência e pressão para eventos médios e grandes',
  },
  {
    id: 'eqp-3',
    codigo: 'MIX-01',
    nome: 'Mesa de Som Digital Behringer X32 Compact',
    categoria: 'mesa_som',
    marcaModelo: 'Behringer / X32 Compact',
    quantidadeTotal: 1,
    quantidadeDisponivel: 1,
    valorDiaria: 350,
    estado: 'excelente',
    observacoes: 'Acompanha roteador Wi-Fi 5GHz para controle via iPad',
  },
  {
    id: 'eqp-4',
    codigo: 'MIC-01',
    nome: 'Microfone Sem Fio Duplo Shure GLXD4 (Beta 58A)',
    categoria: 'microfones',
    marcaModelo: 'Shure / GLXD4 Beta 58A',
    quantidadeTotal: 2,
    quantidadeDisponivel: 2,
    valorDiaria: 150,
    estado: 'excelente',
    observacoes: 'Baterias recarregáveis inclusas',
  },
  {
    id: 'eqp-5',
    codigo: 'MON-01',
    nome: 'Monitor de Palco Yamaha DBR12 (12" 1000W)',
    categoria: 'retorno_palco',
    marcaModelo: 'Yamaha / DBR12',
    quantidadeTotal: 4,
    quantidadeDisponivel: 4,
    valorDiaria: 120,
    estado: 'bom',
    observacoes: 'Retorno limpo e resistente para chão',
  },
  {
    id: 'eqp-6',
    codigo: 'LUZ-01',
    nome: 'Kit 4x Moving Head Beam 7R + Mesa DMX',
    categoria: 'iluminacao',
    marcaModelo: 'Beam 230W 7R',
    quantidadeTotal: 2,
    quantidadeDisponivel: 2,
    valorDiaria: 400,
    estado: 'excelente',
    observacoes: 'Em flight case com garras e cabos DMX',
  },
  {
    id: 'eqp-7',
    codigo: 'BOX-01',
    nome: 'Estrutura Trave Gol Box Truss Q25 (3x3m)',
    categoria: 'estrutura_box',
    marcaModelo: 'Estruturas Alumínio Q25',
    quantidadeTotal: 2,
    quantidadeDisponivel: 2,
    valorDiaria: 250,
    estado: 'bom',
    observacoes: 'Inclui 2 bases pesadas de ferro e parafusos',
  },
]

const DEFAULT_LOCACOES: LocacaoEvento[] = [
  {
    id: 'loc-1',
    numeroContrato: 'LOC-2026-001',
    clienteNome: 'Espaço Jardim & Eventos (Contato: Roberto)',
    clienteDocumento: '12.345.678/0001-90',
    clienteTelefone: '(11) 98765-4321',
    clienteEmail: 'contato@espacojardim.com.br',
    eventoNome: 'Festa de 15 Anos - Beatriz',
    localEvento: 'Espaço Jardim - Salão Nobre (Granja Viana - Cotia/SP)',
    dataRetiradaEntrega: '2026-10-17 14:00',
    dataEvento: '2026-10-17',
    dataDevolucao: '2026-10-18 10:00',
    status: 'confirmada',
    itens: [
      {
        equipamentoId: 'eqp-1',
        nome: 'Caixa Ativa RCF ART 715-A (15" 1400W)',
        quantidade: 2,
        valorUnitario: 180,
        subtotal: 360,
      },
      {
        equipamentoId: 'eqp-2',
        nome: 'Subwoofer Ativo 18" JBL SRX818SP',
        quantidade: 2,
        valorUnitario: 250,
        subtotal: 500,
      },
      {
        equipamentoId: 'eqp-4',
        nome: 'Microfone Sem Fio Duplo Shure GLXD4',
        quantidade: 1,
        valorUnitario: 150,
        subtotal: 150,
      },
      {
        equipamentoId: 'eqp-6',
        nome: 'Kit 4x Moving Head Beam 7R + Mesa DMX',
        quantidade: 1,
        valorUnitario: 400,
        subtotal: 400,
      },
    ],
    incluiOperadorSom: true,
    valorOperadorSom: 300,
    incluiTransporteFrete: true,
    valorFrete: 150,
    desconto: 60,
    valorTotal: 1800,
    valorSinal: 900,
    formaPagamento: 'PIX (50% no fechamento e 50% na montagem)',
    chavePix: 'mauriciogoulart.deoliveira37@gmail.com',
    observacoes: 'Chegada às 14h para montagem completa e alinhamento do som. Festa inicia às 20h.',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
]

export const locadoraService = {
  async listarEquipamentos(): Promise<EquipamentoItem[]> {
    try {
      const stored = localStorage.getItem(STORAGE_EQUIPAMENTOS_KEY)
      if (stored) {
        return JSON.parse(stored) as EquipamentoItem[]
      }
    } catch (e) {
      console.error('Erro ao listar equipamentos:', e)
    }
    localStorage.setItem(STORAGE_EQUIPAMENTOS_KEY, JSON.stringify(DEFAULT_EQUIPAMENTOS))
    return DEFAULT_EQUIPAMENTOS
  },

  async criarEquipamento(payload: NovoEquipamentoPayload): Promise<EquipamentoItem> {
    const list = await this.listarEquipamentos()
    const novo: EquipamentoItem = {
      ...payload,
      id: `eqp-${Date.now()}`,
    }
    const updated = [novo, ...list]
    localStorage.setItem(STORAGE_EQUIPAMENTOS_KEY, JSON.stringify(updated))
    return novo
  },

  async atualizarEquipamento(id: string, payload: Partial<EquipamentoItem>): Promise<EquipamentoItem | null> {
    const list = await this.listarEquipamentos()
    const index = list.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updatedItem = { ...list[index], ...payload }
    list[index] = updatedItem
    localStorage.setItem(STORAGE_EQUIPAMENTOS_KEY, JSON.stringify(list))
    return updatedItem
  },

  async excluirEquipamento(id: string): Promise<boolean> {
    const list = await this.listarEquipamentos()
    const filtered = list.filter((e) => e.id !== id)
    localStorage.setItem(STORAGE_EQUIPAMENTOS_KEY, JSON.stringify(filtered))
    return true
  },

  async listarLocacoes(): Promise<LocacaoEvento[]> {
    try {
      const stored = localStorage.getItem(STORAGE_LOCACOES_KEY)
      if (stored) {
        return JSON.parse(stored) as LocacaoEvento[]
      }
    } catch (e) {
      console.error('Erro ao listar locações:', e)
    }
    localStorage.setItem(STORAGE_LOCACOES_KEY, JSON.stringify(DEFAULT_LOCACOES))
    return DEFAULT_LOCACOES
  },

  async criarLocacao(payload: NovaLocacaoPayload): Promise<LocacaoEvento> {
    const list = await this.listarLocacoes()
    const ano = new Date().getFullYear()
    const count = list.length + 1
    const numeroContrato = `LOC-${ano}-${String(count).padStart(3, '0')}`

    const nova: LocacaoEvento = {
      ...payload,
      id: `loc-${Date.now()}`,
      numeroContrato,
      createdAt: new Date().toISOString(),
    }

    const updated = [nova, ...list]
    localStorage.setItem(STORAGE_LOCACOES_KEY, JSON.stringify(updated))
    return nova
  },

  async atualizarStatusLocacao(id: string, status: LocacaoEvento['status']): Promise<boolean> {
    const list = await this.listarLocacoes()
    const index = list.findIndex((l) => l.id === id)
    if (index === -1) return false
    list[index].status = status
    localStorage.setItem(STORAGE_LOCACOES_KEY, JSON.stringify(list))
    return true
  },

  async excluirLocacao(id: string): Promise<boolean> {
    const list = await this.listarLocacoes()
    const filtered = list.filter((l) => l.id !== id)
    localStorage.setItem(STORAGE_LOCACOES_KEY, JSON.stringify(filtered))
    return true
  },
}
