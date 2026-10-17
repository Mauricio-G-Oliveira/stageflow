import type { Orcamento, NovoOrcamentoPayload } from '../types/orcamento'
import { bandaConfigService } from './bandaConfigService'

const STORAGE_KEY = 'stageflow_orcamentos_v1'

const ITENS_INCLUSOS_PADRAO = [
  'Apresentação musical ao vivo com repertório dinâmico e personalizado',
  'Formação completa: 4 Músicos no palco + 1 Roadie de suporte',
  'Sistema de som profissional P.A. + Fones de retorno in-ear',
  'Microfones Shure, pedestais e cabeamento balanceado próprio',
  'Iluminação básica cênica de palco (Refletores Slim LED)',
  'Música ambiente nos intervalos entre os blocos do show',
]

const DEFAULT_ORCAMENTOS: Orcamento[] = [
  {
    id: 'orc-1',
    numeroOrcamento: 'ORC-2024/001',
    status: 'pendente',
    dataEmissao: new Date().toISOString().split('T')[0],
    validadeDias: 10,
    nomeBanda: bandaConfigService.getConfig().nomeBanda,
    cliente: {
      nome: 'Juliana Mendes & Rafael Costa',
      telefone: '(11) 98765-4321',
      email: 'juliana.mendes@exemplo.com',
      tipoEvento: 'Casamento / Recepção',
      localEvento: 'Espaço Villa Bisutti',
      cidade: 'São Paulo - SP',
      dataEvento: '2024-11-23',
      horarioInicio: '21:30',
      duracaoShow: '3 horas de apresentação (2 sets de 1h20)',
      publicoEstimado: '180 convidados',
    },
    proposta: {
      formacaoBanda: 'Banda Completa: 4 Músicos no palco + 1 Roadie de apoio',
      itensInclusos: ITENS_INCLUSOS_PADRAO,
      valorTotal: 5500,
      valorSinal: 2750,
      valorRestante: 2750,
      formaPagamento: '50% de entrada para reserva de data via Pix + 50% até a passagem de som no dia do evento',
      chavePix: 'mauriciogoulart.deoliveira37@gmail.com',
      beneficiarioPix: 'Mauricio G. Oliveira',
      observacoes: 'Montagem dos equipamentos com 3 horas de antecedência. Repertório customizado com os noivos.',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class OrcamentoService {
  private getStorage(): Orcamento[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler orçamentos do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORCAMENTOS))
    return DEFAULT_ORCAMENTOS
  }

  private setStorage(orcamentos: Orcamento[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos))
    } catch (e) {
      console.error('Erro ao salvar orçamentos no localStorage:', e)
    }
  }

  async listarTodos(): Promise<Orcamento[]> {
    return this.getStorage()
  }

  async buscarPorId(id: string): Promise<Orcamento | null> {
    const list = this.getStorage()
    return list.find((o) => o.id === id) || null
  }

  async criar(payload: NovoOrcamentoPayload): Promise<Orcamento> {
    const list = this.getStorage()
    const anoAtual = new Date().getFullYear()
    const proximoNumero = String(list.length + 1).padStart(3, '0')
    const now = new Date().toISOString()

    const novo: Orcamento = {
      ...payload,
      id: `orc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      numeroOrcamento: `ORC-${anoAtual}/${proximoNumero}`,
      createdAt: now,
      updatedAt: now,
    }

    const updated = [novo, ...list]
    this.setStorage(updated)
    return novo
  }

  async atualizar(id: string, payload: Partial<NovoOrcamentoPayload>): Promise<Orcamento | null> {
    const list = this.getStorage()
    const index = list.findIndex((o) => o.id === id)
    if (index === -1) return null

    const updated: Orcamento = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    this.setStorage(list)
    return updated
  }

  async atualizarStatus(id: string, status: Orcamento['status']): Promise<Orcamento | null> {
    return this.atualizar(id, { status })
  }

  async excluir(id: string): Promise<boolean> {
    const list = this.getStorage()
    const filtered = list.filter((o) => o.id !== id)
    this.setStorage(filtered)
    return true
  }

  gerarTextoWhatsApp(orc: Orcamento): string {
    const dataFormatada = new Date(orc.cliente.dataEvento + 'T00:00:00').toLocaleDateString('pt-BR')
    const validadeData = new Date(
      new Date(orc.dataEmissao).getTime() + orc.validadeDias * 24 * 60 * 60 * 1000
    ).toLocaleDateString('pt-BR')

    return `Olá, *${orc.cliente.nome}*! 👋 Tudo bem?

Segue a proposta comercial exclusiva da *${orc.nomeBanda}* para o seu evento:

🎶 *Evento:* ${orc.cliente.tipoEvento}
📅 *Data:* ${dataFormatada}
⏰ *Início previsto:* ${orc.cliente.horarioInicio} (${orc.cliente.duracaoShow})
📍 *Local:* ${orc.cliente.localEvento} - ${orc.cliente.cidade}

✨ *O que está incluso:*
${orc.proposta.itensInclusos.map((item) => `• ${item}`).join('\n')}

💰 *Investimento Total:* R$ ${orc.proposta.valorTotal.toLocaleString('pt-BR')}
💳 *Condição:* ${orc.proposta.formaPagamento}
🔐 *Sinal de Reserva:* R$ ${orc.proposta.valorSinal.toLocaleString('pt-BR')} (Chave PIX: ${orc.proposta.chavePix})
⏳ *Proposta válida até:* ${validadeData}

Ficamos à disposição para tirar qualquer dúvida e garantir a reserva da sua data! 🚀`
  }
}

export const orcamentoService = new OrcamentoService()
export { ITENS_INCLUSOS_PADRAO }
