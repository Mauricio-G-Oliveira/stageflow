export type CategoriaEquipamentoBanda =
  | 'som_pa'
  | 'retorno_in_ear'
  | 'mesa_som'
  | 'microfones'
  | 'instrumentos_amps'
  | 'iluminacao'
  | 'cabos_cases'
  | 'outros'

export type EstadoEquipamento = 'novo' | 'excelente' | 'bom' | 'manutencao'

export interface EquipamentoBanda {
  id: string
  nome: string
  categoria: CategoriaEquipamentoBanda
  marcaModelo?: string
  quantidade: number
  valorPago: number // Valor em R$ pago na compra
  dataCompra: string // YYYY-MM-DD
  formaCompra: string // Como foi comprado (Cartão 10x, Pix, À vista, etc.)
  quemPagou: string // Quem pagou (Maurício, Caixa da Banda, Divisão entre integrantes...)
  estado: EstadoEquipamento
  localArmazenamento?: string // Onde fica guardado (Van, Casa do Maurício, Estúdio...)
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export type NovoEquipamentoBandaPayload = Omit<EquipamentoBanda, 'id' | 'createdAt' | 'updatedAt'>
