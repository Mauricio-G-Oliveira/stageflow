export type CategoriaEquipamento =
  | 'som_pa'
  | 'retorno_palco'
  | 'mesa_som'
  | 'microfones'
  | 'iluminacao'
  | 'estrutura_box'
  | 'cabos_perifericos'
  | 'gerador_energia'

export type EstadoConservacao = 'excelente' | 'bom' | 'manutencao'

export interface EquipamentoItem {
  id: string
  codigo: string
  nome: string
  categoria: CategoriaEquipamento
  marcaModelo: string
  quantidadeTotal: number
  quantidadeDisponivel: number
  valorDiaria: number
  estado: EstadoConservacao
  observacoes?: string
}

export type NovoEquipamentoPayload = Omit<EquipamentoItem, 'id'>

export type StatusLocacao =
  | 'orcamento'
  | 'confirmada'
  | 'em_andamento'
  | 'devolvida'
  | 'cancelada'

export interface ItemLocado {
  equipamentoId: string
  nome: string
  quantidade: number
  valorUnitario: number
  subtotal: number
}

export interface LocacaoEvento {
  id: string
  numeroContrato: string
  clienteNome: string
  clienteDocumento: string
  clienteTelefone: string
  clienteEmail?: string
  eventoNome: string
  localEvento: string
  dataRetiradaEntrega: string // YYYY-MM-DD ou data/hora
  dataEvento: string
  dataDevolucao: string
  status: StatusLocacao
  itens: ItemLocado[]
  incluiOperadorSom: boolean
  valorOperadorSom: number
  incluiTransporteFrete: boolean
  valorFrete: number
  desconto: number
  valorTotal: number
  valorSinal: number
  formaPagamento: string
  chavePix?: string
  observacoes?: string
  createdAt: string
}

export type NovaLocacaoPayload = Omit<LocacaoEvento, 'id' | 'numeroContrato' | 'createdAt'>
