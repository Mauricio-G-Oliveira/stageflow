export type StatusOrcamento = 'pendente' | 'aprovado' | 'recusado' | 'convertido_contrato'

export interface Orcamento {
  id: string
  numeroOrcamento: string
  status: StatusOrcamento
  dataEmissao: string
  validadeDias: number
  nomeBanda: string

  // Dados do Cliente
  cliente: {
    nome: string
    telefone: string
    email?: string
    tipoEvento: string
    localEvento: string
    cidade: string
    dataEvento: string
    horarioInicio: string
    duracaoShow: string
    publicoEstimado?: string
  }

  // Detalhes da Proposta Musical
  proposta: {
    formacaoBanda: string
    itensInclusos: string[]
    valorTotal: number
    valorSinal: number
    valorRestante: number
    formaPagamento: string
    chavePix: string
    beneficiarioPix: string
    observacoes?: string
  }

  createdAt: string
  updatedAt: string
}

export type NovoOrcamentoPayload = Omit<Orcamento, 'id' | 'numeroOrcamento' | 'createdAt' | 'updatedAt'>
