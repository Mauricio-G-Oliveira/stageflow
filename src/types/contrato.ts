export type ModeloContrato = 'casamento' | 'festa_fechada' | 'corporativo' | 'geral'
export type StatusContrato = 'rascunho' | 'emitido' | 'assinado'

export interface ClausulaContratual {
  id: string
  titulo: string
  conteudo: string
}

export interface Contrato {
  id: string
  numeroContrato: string
  eventoId?: string
  modelo: ModeloContrato
  status: StatusContrato

  // Dados do Contratante (Cliente)
  contratante: {
    nome: string
    cpfCnpj: string
    rg?: string
    telefone: string
    email: string
    enderecoCompleto: string
    cidade: string
    estado: string
  }

  // Dados do Contratado (Banda / Responsável)
  contratado: {
    nomeBanda: string
    representanteNome: string
    cpfRepresentante: string
    rgRepresentante?: string
    telefone: string
    email: string
    chavePix: string
  }

  // Detalhes da Apresentação
  detalhesShow: {
    data: string
    localNome: string
    enderecoShow: string
    cidadeShow: string
    horarioChegadaMontagem: string
    horarioPassagemSom: string
    horarioInicioShow: string
    duracaoShow: string // ex: "3 horas (2 sets de 1h30)"
    formacaoBanda: string // ex: "Banda completa com 5 músicos (Voz, Guitarra, Baixo, Teclado, Bateria)"
  }

  // Condições Financeiras
  financeiro: {
    valorTotal: number
    valorSinal: number
    dataVencimentoSinal: string
    valorRestante: number
    dataVencimentoRestante: string
    formaPagamento: string
    chavePix: string
    beneficiarioPix: string
  }

  // Cláusulas Contratuais (Personalizáveis)
  clausulas: ClausulaContratual[]

  // Observações Especiais
  observacoesAdicionais?: string

  createdAt: string
  updatedAt: string
}

export type NovoContratoPayload = Omit<Contrato, 'id' | 'createdAt' | 'updatedAt'>
