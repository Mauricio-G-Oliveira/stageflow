import type { Musica, NovaMusicaPayload } from '../types/repertorio'

const STORAGE_KEY = 'stageflow_repertorio_v1'

const DEFAULT_SONGS: Musica[] = [
  {
    id: 'sng-1',
    titulo: 'Stand by Me',
    artista: 'Ben E. King',
    tom: 'A',
    genero: 'Soul / R&B',
    duracao: '3:05',
    linkCifra: 'https://www.cifraclub.com.br/ben-e-king/stand-by-me/',
    observacoes: 'Entrada dos padrinhos ou início de pista animado',
    ativa: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sng-2',
    titulo: 'Don’t Stop Believin’',
    artista: 'Journey',
    tom: 'E',
    genero: 'Classic Rock',
    duracao: '4:10',
    linkCifra: 'https://www.cifraclub.com.br/journey/dont-stop-believin/',
    observacoes: 'Clímax da pista de dança',
    ativa: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sng-3',
    titulo: 'Valerie',
    artista: 'Amy Winehouse',
    tom: 'Eb',
    genero: 'Soul / Pop',
    duracao: '3:40',
    linkCifra: 'https://www.cifraclub.com.br/amy-winehouse/valerie/',
    observacoes: 'Excelente para abertura de pista com metais',
    ativa: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sng-4',
    titulo: 'O Sol',
    artista: 'Jota Quest',
    tom: 'C',
    genero: 'Pop Rock Nacional',
    duracao: '3:50',
    linkCifra: 'https://www.cifraclub.com.br/jota-quest/o-sol/',
    observacoes: 'Público canta junto',
    ativa: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sng-5',
    titulo: 'Trevo (Tu)',
    artista: 'Anavitória',
    tom: 'G',
    genero: 'Acústico / MPB',
    duracao: '3:20',
    linkCifra: 'https://www.cifraclub.com.br/anavitoria/trevo-tu/',
    observacoes: 'Momento suave / recepção / jantar',
    ativa: true,
    createdAt: new Date().toISOString(),
  },
]

class RepertorioService {
  private getStorage(): Musica[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler repertório do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SONGS))
    return DEFAULT_SONGS
  }

  private setStorage(musicas: Musica[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(musicas))
    } catch (e) {
      console.error('Erro ao salvar repertório no localStorage:', e)
    }
  }

  async listarTodas(): Promise<Musica[]> {
    return this.getStorage()
  }

  async buscarPorId(id: string): Promise<Musica | null> {
    const list = this.getStorage()
    return list.find((m) => m.id === id) || null
  }

  async criar(payload: NovaMusicaPayload): Promise<Musica> {
    const list = this.getStorage()
    const nova: Musica = {
      ...payload,
      id: `sng-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    }
    const updated = [nova, ...list]
    this.setStorage(updated)
    return nova
  }

  async atualizar(id: string, payload: Partial<NovaMusicaPayload>): Promise<Musica | null> {
    const list = this.getStorage()
    const index = list.findIndex((m) => m.id === id)
    if (index === -1) return null

    const updated: Musica = {
      ...list[index],
      ...payload,
    }
    list[index] = updated
    this.setStorage(list)
    return updated
  }

  async excluir(id: string): Promise<boolean> {
    const list = this.getStorage()
    const filtered = list.filter((m) => m.id !== id)
    this.setStorage(filtered)
    return true
  }
}

export const repertorioService = new RepertorioService()
