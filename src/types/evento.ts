export type TipoEvento =
  | 'casamento'
  | 'festa_fechada'
  | 'aniversario'
  | 'corporativo'
  | 'show_publico'
  | 'bar_restaurante'
  | 'geral'
  | 'outro'

export type StatusEvento = 'orcamento' | 'confirmado' | 'realizado' | 'cancelado'

export interface MusicoEscalado {
  musicoId: string
  nome: string
  instrumento: string
  cache: number
  confirmado: boolean
}

export interface FechadorEvento {
  musicoId?: string
  nome: string
  comissaoPorcentagem?: number
  comissaoValor?: number
}

export interface Evento {
  id: string
  titulo: string
  tipoEvento: TipoEvento
  data: string // YYYY-MM-DD
  status: StatusEvento

  // Horários Técnicos de Palco
  horarioMontagem: string // HH:mm
  horarioPassagemSom: string // HH:mm
  horarioInicioShow: string // HH:mm
  tempoShowMinutos: number // Duração total em minutos (ex: 180 min = 3h)
  numeroSets: number // ex: 2 ou 3 sets
  intervaloMinutos: number // ex: 20 min

  // Local & Logística
  localNome: string
  endereco: string
  cidade: string
  estado: string

  // Dados do Contratante
  contratanteNome: string
  contratanteTelefone: string
  contratanteEmail?: string
  contratanteDocumento?: string // CPF ou CNPJ

  // Quem Fechou o Show na Banda
  fechadoPor: FechadorEvento

  // Financeiro & Rateio (Padrão Banda 5+ Músicos)
  cacheTotal: number
  cachePorMusico: number
  valorSinal: number
  dataVencimentoSinal?: string
  formaPagamento: 'pix' | 'transferencia' | 'dinheiro' | 'cartao' | 'a_combinar'
  chavePixPagamento?: string

  // Escalação da Banda (5+ Músicos)
  musicosEscalados: MusicoEscalado[]

  // Repertório & Equipamentos
  repertorioIds?: string[]
  equipamentos?: string[]
  observacoes?: string

  createdAt: string
  updatedAt: string
}

export type NovoEventoPayload = Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>
