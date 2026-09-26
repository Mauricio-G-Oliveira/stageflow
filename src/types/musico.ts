export type TipoVinculoMusico = 'fixo' | 'freelancer' | 'substituto' | 'tecnico'

export interface Musico {
  id: string
  nome: string
  instrumentoPrincipal: string
  instrumentosSecundarios?: string[]
  tipoVinculo: TipoVinculoMusico
  telefone: string
  email?: string
  chavePix?: string
  cachePadrao?: number
  status: 'ativo' | 'inativo'
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export type NovoMusicoPayload = Omit<Musico, 'id' | 'createdAt' | 'updatedAt'>
