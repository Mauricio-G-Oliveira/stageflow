export interface Musica {
  id: string
  titulo: string
  artista: string
  tom: string
  genero: string
  duracao?: string
  linkCifra?: string
  linkAudio?: string
  observacoes?: string
  ativa: boolean
  createdAt: string
}

export type NovaMusicaPayload = Omit<Musica, 'id' | 'createdAt'>
