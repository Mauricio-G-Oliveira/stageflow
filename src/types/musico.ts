export type TipoVinculoMusico = 'fixo' | 'freelancer' | 'substituto' | 'apoio'
export type CategoriaEquipe = 'musico' | 'tecnico'

export interface Musico {
  id: string
  nome: string
  categoria: CategoriaEquipe // 'musico' (palco) ou 'tecnico' (roadie/som/luz)
  instrumentoPrincipal: string // Função/Instrumento (ex: "Vocal", "Guitarra", "Baixo", "Bateria", "Roadie", "Técnico de Som")
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
