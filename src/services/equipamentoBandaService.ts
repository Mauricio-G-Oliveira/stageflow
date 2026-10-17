import type { EquipamentoBanda, NovoEquipamentoBandaPayload } from '../types/equipamentoBanda'

const STORAGE_KEY = 'stageflow_equipamentos_banda_v1'

const DEFAULT_INVENTARIO: EquipamentoBanda[] = [
  {
    id: 'eq-1',
    nome: 'Par de Caixas Ativas P.A. 15" RCF ART 715-A',
    categoria: 'som_pa',
    marcaModelo: 'RCF ART 715-A MK4 (1400W cada)',
    quantidade: 2,
    valorPago: 9500,
    dataCompra: '2024-03-15',
    formaCompra: 'Cartão de Crédito (10x sem juros)',
    quemPagou: 'Maurício G. Oliveira',
    estado: 'excelente',
    localArmazenamento: 'Van de Transporte',
    observacoes: 'Acompanha par de capas acolchoadas e tripés de ferro reforçados.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eq-2',
    nome: 'Mesa de Som Digital Behringer X-Air XR18',
    categoria: 'mesa_som',
    marcaModelo: 'Behringer XR18 com Roteador 5GHz Externo',
    quantidade: 1,
    valorPago: 4800,
    dataCompra: '2024-05-10',
    formaCompra: 'À vista via Pix',
    quemPagou: 'Caixa Geral da Banda',
    estado: 'excelente',
    localArmazenamento: 'Hard Case com Roadie',
    observacoes: 'Controlada via iPad/Celular de cada músico para fones in-ear.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eq-3',
    nome: 'Sistemas Sem Fio de Retorno In-Ear (Kit 4 Fones)',
    categoria: 'retorno_in_ear',
    marcaModelo: 'Anleon S2 Pro UHF com Fones KZ ZS10 Pro',
    quantidade: 4,
    valorPago: 2400,
    dataCompra: '2024-06-20',
    formaCompra: 'Divisão em 4 parcelas no cartão',
    quemPagou: 'Divisão entre os 4 Músicos',
    estado: 'novo',
    localArmazenamento: 'Maleta dos Músicos',
    observacoes: 'Cada músico comprou e personalizou o seu canal de monitor.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eq-4',
    nome: 'Kit de Microfones Shure (Vozes & Instrumentos)',
    categoria: 'microfones',
    marcaModelo: '2x Shure Beta 58A + 2x Shure SM57 + 1x Beta 52A',
    quantidade: 5,
    valorPago: 3900,
    dataCompra: '2024-04-02',
    formaCompra: 'Pix com desconto de 10%',
    quemPagou: 'Caixa Geral da Banda',
    estado: 'excelente',
    localArmazenamento: 'Case de Microfones',
    observacoes: 'Acompanha pedestais girafa e cachimbos originais.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eq-5',
    nome: 'Kit de Iluminação Cênica LED Par 64 RGBW',
    categoria: 'iluminacao',
    marcaModelo: '4x Refletores Slim LED DMX + Mesa DMX 512',
    quantidade: 4,
    valorPago: 1600,
    dataCompra: '2024-07-12',
    formaCompra: 'Cartão de Crédito (3x)',
    quemPagou: 'Maurício G. Oliveira',
    estado: 'bom',
    localArmazenamento: 'Bag de Iluminação',
    observacoes: 'Cria clima visual para o palco em casamentos e festas fechadas.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eq-6',
    nome: 'Kit Completo de Cabos XLR & Extensões de Energia',
    categoria: 'cabos_cases',
    marcaModelo: 'Santo Angelo Ninja XLR 10m (10 unid) + Filtros de Linha',
    quantidade: 12,
    valorPago: 1200,
    dataCompra: '2024-08-01',
    formaCompra: 'Dinheiro de cachê de show',
    quemPagou: 'Caixa Geral da Banda',
    estado: 'excelente',
    localArmazenamento: 'Bag de Cabos do Roadie',
    observacoes: 'Cabos identificados por cor para agilizar montagem e desmontagem.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class EquipamentoBandaService {
  private getStorage(): EquipamentoBanda[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler inventário do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INVENTARIO))
    return DEFAULT_INVENTARIO
  }

  private setStorage(items: EquipamentoBanda[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Erro ao salvar inventário no localStorage:', e)
    }
  }

  async listarTodos(): Promise<EquipamentoBanda[]> {
    return this.getStorage()
  }

  async criar(payload: NovoEquipamentoBandaPayload): Promise<EquipamentoBanda> {
    const list = this.getStorage()
    const now = new Date().toISOString()
    const novo: EquipamentoBanda = {
      ...payload,
      id: `eqp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [novo, ...list]
    this.setStorage(updated)
    return novo
  }

  async atualizar(id: string, payload: Partial<NovoEquipamentoBandaPayload>): Promise<EquipamentoBanda | null> {
    const list = this.getStorage()
    const index = list.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updated: EquipamentoBanda = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    this.setStorage(list)
    return updated
  }

  async excluir(id: string): Promise<boolean> {
    const list = this.getStorage()
    const filtered = list.filter((e) => e.id !== id)
    this.setStorage(filtered)
    return true
  }
}

export const equipamentoBandaService = new EquipamentoBandaService()
