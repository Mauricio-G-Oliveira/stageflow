export interface DocumentoAnexo {
  nome: string
  tipo: 'pdf' | 'docx' | 'txt'
  url?: string
  conteudoTexto?: string
  dataUpload: string
}

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
  documento?: DocumentoAnexo
  ativa: boolean
  createdAt: string
}

export type NovaMusicaPayload = Omit<Musica, 'id' | 'createdAt'>
