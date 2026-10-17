import type { Musico, NovoMusicoPayload } from '../types/musico'

const STORAGE_KEY = 'stageflow_equipe_banda_v3'

// Formação inicial solicitada: 4 músicos no palco + 1 roadie (5 pessoas total)
const DEFAULT_EQUIPE: Musico[] = [
  {
    id: 'mus-1',
    nome: 'Mauricio G. Oliveira',
    categoria: 'musico',
    instrumentoPrincipal: 'Baixo & Direção Musical',
    instrumentosSecundarios: ['Backing Vocal', 'Arranjos'],
    tipoVinculo: 'fixo',
    telefone: '(11) 99999-9999',
    email: 'mauriciogoulart.deoliveira37@gmail.com',
    chavePix: 'mauriciogoulart.deoliveira37@gmail.com',
    cachePadrao: 1000,
    status: 'ativo',
    observacoes: 'Fundador e Direção da Banda',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mus-2',
    nome: 'Cantor(a) / Voz',
    categoria: 'musico',
    instrumentoPrincipal: 'Voz Principal & Violão',
    instrumentosSecundarios: ['Violão'],
    tipoVinculo: 'fixo',
    telefone: '(11) 98888-8888',
    chavePix: 'cantor@exemplo.com',
    cachePadrao: 1000,
    status: 'ativo',
    observacoes: 'Frontman / Vocal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mus-3',
    nome: 'Guitarrista',
    categoria: 'musico',
    instrumentoPrincipal: 'Guitarra Solo & Base',
    instrumentosSecundarios: ['Backing Vocal', 'Pedaleira'],
    tipoVinculo: 'fixo',
    telefone: '(11) 97777-7777',
    chavePix: 'guitarra@exemplo.com',
    cachePadrao: 1000,
    status: 'ativo',
    observacoes: 'Guitarras e solos',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mus-4',
    nome: 'Baterista',
    categoria: 'musico',
    instrumentoPrincipal: 'Bateria & Percussão',
    instrumentosSecundarios: ['Click', 'Samplers'],
    tipoVinculo: 'fixo',
    telefone: '(11) 96666-6666',
    chavePix: 'bateria@exemplo.com',
    cachePadrao: 1000,
    status: 'ativo',
    observacoes: 'Bateria e metrônomo/click',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mus-5',
    nome: 'Roadie 1 (Apoio de Palco)',
    categoria: 'tecnico',
    instrumentoPrincipal: 'Roadie / Apoio de Palco',
    instrumentosSecundarios: ['Montagem de Cabos', 'Afinação de Instrumentos'],
    tipoVinculo: 'apoio',
    telefone: '(11) 95555-5555',
    chavePix: 'roadie1@exemplo.com',
    cachePadrao: 350,
    status: 'ativo',
    observacoes: 'Responsável pela passagem de cabos, troca de instrumentos e suporte de palco',
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
      console.error('Erro ao ler equipe do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EQUIPE))
    return DEFAULT_EQUIPE
  }

  private setStorage(equipe: Musico[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(equipe))
    } catch (e) {
      console.error('Erro ao salvar equipe no localStorage:', e)
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
      id: `eq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [...list, novo]
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
