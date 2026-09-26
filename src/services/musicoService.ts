import type { Musico, NovoMusicoPayload } from '../types/musico'

const STORAGE_KEY = 'stageflow_musicos_v2'

// Initial template for a standard 5+ piece band
const DEFAULT_BAND_MEMBERS: Musico[] = [
  {
    id: 'mus-1',
    nome: 'Mauricio G. Oliveira',
    instrumentoPrincipal: 'Baixo',
    instrumentosSecundarios: ['Voz', 'Direção Musical'],
    tipoVinculo: 'fixo',
    telefone: '(11) 99999-9999',
    email: 'mauriciogoulart.deoliveira37@gmail.com',
    chavePix: 'mauriciogoulart.deoliveira37@gmail.com',
    cachePadrao: 1000,
    status: 'ativo',
    observacoes: 'Fundador e Direção Musical',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class MusicoService {
  private getStorage(): Musico[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler músicos do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BAND_MEMBERS))
    return DEFAULT_BAND_MEMBERS
  }

  private setStorage(musicos: Musico[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(musicos))
    } catch (e) {
      console.error('Erro ao salvar músicos no localStorage:', e)
    }
  }

  async listarTodos(): Promise<Musico[]> {
    return this.getStorage()
  }

  async buscarPorId(id: string): Promise<Musico | null> {
    const list = this.getStorage()
    return list.find((m) => m.id === id) || null
  }

  async criar(payload: NovoMusicoPayload): Promise<Musico> {
    const list = this.getStorage()
    const now = new Date().toISOString()
    const novo: Musico = {
      ...payload,
      id: `mus-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [novo, ...list]
    this.setStorage(updated)
    return novo
  }

  async atualizar(id: string, payload: Partial<NovoMusicoPayload>): Promise<Musico | null> {
    const list = this.getStorage()
    const index = list.findIndex((m) => m.id === id)
    if (index === -1) return null

    const updatedMusico: Musico = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    list[index] = updatedMusico
    this.setStorage(list)
    return updatedMusico
  }

  async excluir(id: string): Promise<boolean> {
    const list = this.getStorage()
    const filtered = list.filter((m) => m.id !== id)
    this.setStorage(filtered)
    return true
  }
}

export const musicoService = new MusicoService()
