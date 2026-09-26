import type { Evento, NovoEventoPayload } from '../types/evento'

const STORAGE_KEY = 'stageflow_eventos_v2'

const INITIAL_EVENTS: Evento[] = [
  {
    id: 'evt-casamento-juliana-rafael',
    titulo: 'Casamento Juliana & Rafael',
    tipoEvento: 'casamento',
    data: '2026-10-17',
    status: 'confirmado',
    horarioMontagem: '16:00',
    horarioPassagemSom: '18:00',
    horarioInicioShow: '22:00',
    tempoShowMinutos: 180, // 3 horas de show
    numeroSets: 2,
    intervaloMinutos: 20,
    localNome: 'Espaço Villa Bisutti - Salão Cristal',
    endereco: 'Rua Casa do Ator, 600',
    cidade: 'São Paulo',
    estado: 'SP',
    contratanteNome: 'Juliana Mendes de Castro',
    contratanteTelefone: '(11) 98765-4321',
    contratanteEmail: 'juliana.mendes@gmail.com',
    contratanteDocumento: '345.890.123-04',
    fechadoPor: {
      nome: 'Mauricio G. Oliveira',
      comissaoPorcentagem: 10,
      comissaoValor: 600,
    },
    cacheTotal: 6000,
    cachePorMusico: 1080, // (R$ 6.000 - R$ 600 comissão) / 5 músicos = R$ 1.080 por músico
    valorSinal: 3000,
    dataVencimentoSinal: '2026-09-30',
    formaPagamento: 'pix',
    chavePixPagamento: 'mauriciogoulart.deoliveira37@gmail.com',
    musicosEscalados: [
      { musicoId: 'mus-1', nome: 'Mauricio G. Oliveira', instrumento: 'Baixo / Voz', cache: 1080, confirmado: true },
      { musicoId: 'mus-2', nome: 'Vocalista Convidada', instrumento: 'Voz Principal', cache: 1080, confirmado: true },
      { musicoId: 'mus-3', nome: 'Guitarrista', instrumento: 'Guitarra / Violão', cache: 1080, confirmado: true },
      { musicoId: 'mus-4', nome: 'Tecladista', instrumento: 'Teclado / Piano', cache: 1080, confirmado: true },
      { musicoId: 'mus-5', nome: 'Baterista', instrumento: 'Bateria', cache: 1080, confirmado: true },
    ],
    equipamentos: [
      'Sistema de PA e Subwoofer',
      'Mesa de som digital + cabeamento',
      '5 Fones in-ear para retorno',
      'Microfones sem fio para voz',
      'Régua de energia 110v/220v aterrada',
    ],
    observacoes: 'Montagem antecipada obrigatória antes das 17h para não coincidir com a chegada dos decoradores.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export interface RelatorioFechador {
  fechadorNome: string
  quantidadeShows: number
  totalCacheBruto: number
  totalComissao: number
  shows: Array<{
    id: string
    titulo: string
    data: string
    localNome: string
    cidade: string
    cacheTotal: number
    comissaoValor?: number
  }>
}

class EventoService {
  private getStorage(): Evento[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler eventos do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS))
    return INITIAL_EVENTS
  }

  private setStorage(eventos: Evento[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos))
    } catch (e) {
      console.error('Erro ao salvar eventos no localStorage:', e)
    }
  }

  async listarTodos(): Promise<Evento[]> {
    return this.getStorage()
  }

  async buscarPorId(id: string): Promise<Evento | null> {
    const list = this.getStorage()
    return list.find((e) => e.id === id) || null
  }

  async criar(payload: NovoEventoPayload): Promise<Evento> {
    const list = this.getStorage()
    const now = new Date().toISOString()
    const novo: Evento = {
      ...payload,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [novo, ...list]
    this.setStorage(updated)
    return novo
  }

  async atualizar(id: string, payload: Partial<NovoEventoPayload>): Promise<Evento | null> {
    const list = this.getStorage()
    const index = list.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updatedEvento: Evento = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    list[index] = updatedEvento
    this.setStorage(list)
    return updatedEvento
  }

  async excluir(id: string): Promise<boolean> {
    const list = this.getStorage()
    const filtered = list.filter((e) => e.id !== id)
    this.setStorage(filtered)
    return true
  }

  // Relatório de prestação de contas: Quem fechou cada show e valores gerados
  async obterRelatorioFechadores(): Promise<RelatorioFechador[]> {
    const eventos = this.getStorage()
    const mapa = new Map<string, RelatorioFechador>()

    eventos.forEach((evt) => {
      const nomeFechador = evt.fechadoPor?.nome?.trim() || 'Não Especificado'
      if (!mapa.has(nomeFechador)) {
        mapa.set(nomeFechador, {
          fechadorNome: nomeFechador,
          quantidadeShows: 0,
          totalCacheBruto: 0,
          totalComissao: 0,
          shows: [],
        })
      }

      const item = mapa.get(nomeFechador)!
      item.quantidadeShows += 1
      item.totalCacheBruto += evt.cacheTotal || 0
      item.totalComissao += evt.fechadoPor?.comissaoValor || 0
      item.shows.push({
        id: evt.id,
        titulo: evt.titulo,
        data: evt.data,
        localNome: evt.localNome,
        cidade: evt.cidade,
        cacheTotal: evt.cacheTotal,
        comissaoValor: evt.fechadoPor?.comissaoValor,
      })
    })

    return Array.from(mapa.values()).sort((a, b) => b.totalCacheBruto - a.totalCacheBruto)
  }
}

export const eventoService = new EventoService()
