import type { Contrato, ModeloContrato, NovoContratoPayload, ClausulaContratual } from '../types/contrato'
import type { Evento } from '../types/evento'

const STORAGE_KEY = 'stageflow_contratos_v1'

export const MODELOS_CLAUSULAS: Record<ModeloContrato, ClausulaContratual[]> = {
  casamento: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DO OBJETO E FORMAÇÃO',
      conteudo:
        'O presente instrumento tem como objeto a prestação de serviços artísticos e musicais para celebração matrimonial, a ser realizada pela CONTRATADA com formação ao vivo composta por músicos profissionais e equipe técnica, executando repertório de alta qualidade previamente alinhado entre as partes.',
    },
    {
      id: 'cl-2',
      titulo: 'CLÁUSULA 2ª - DO CRONOGRAMA E HORÁRIOS DE PALCO',
      conteudo:
        'A CONTRATADA compromete-se a chegar ao local com antecedência técnica estipulada para descarga e montagem do sistema de som e iluminação sem interferir na decoração ou na chegada dos convidados. A passagem de som será concluída antes do início da recepção dos noivos.',
    },
    {
      id: 'cl-3',
      titulo: 'CLÁUSULA 3ª - DA INFRAESTRUTURA, ALIMENTAÇÃO E CAMARIM',
      conteudo:
        'O CONTRATANTE fornecerá: a) Espaço físico nivelado, coberto e protegido contra intempéries climáticas; b) Fornecimento de energia elétrica estável (110v/220v) com aterramento a uma distância máxima de 10 metros do palco; c) Alimentação completa e bebidas (água mineral, refrigerantes e café) para todos os integrantes da banda e equipe técnica durante o período de permanência.',
    },
    {
      id: 'cl-4',
      titulo: 'CLÁUSULA 4ª - DAS CONDIÇÕES DE PAGAMENTO',
      conteudo:
        'O valor pactuado será quitado em duas parcelas: a primeira a título de sinal e garantia irrevogável de reserva de data na assinatura deste contrato, e o saldo remanescente impreterivelmente até a data da apresentação, antes do início da execução do show musical.',
    },
    {
      id: 'cl-5',
      titulo: 'CLÁUSULA 5ª - DA HORA EXTRA E PRORROGAÇÃO',
      conteudo:
        'Qualquer solicitação de prorrogação do tempo de show além do contratado dependerá de prévio acordo entre CONTRATANTE e a liderança da BANDA no local, sendo cobrada taxa de hora extra correspondente a 30% do valor do cachê total por hora adicional.',
    },
    {
      id: 'cl-6',
      titulo: 'CLÁUSULA 6ª - DO CANCELAMENTO E RESCISÃO',
      conteudo:
        'Em caso de cancelamento unilateral por parte do CONTRATANTE com menos de 30 (trinta) dias de antecedência do evento, o valor pago a título de sinal não será restituído, face à reserva exclusiva da data pela CONTRATADA.',
    },
    {
      id: 'cl-7',
      titulo: 'CLÁUSULA 7ª - DO FORO',
      conteudo:
        'Para dirimir quaisquer dúvidas ou litígios oriundos deste contrato, as partes elegem o foro da Comarca do local da apresentação, com renúncia expressa a qualquer outro, por mais privilegiado que seja.',
    },
  ],

  festa_fechada: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DO OBJETO',
      conteudo:
        'Constitui objeto do presente contrato a realização de apresentação musical ao vivo da CONTRATADA no evento particular/festa fechada do CONTRATANTE, com repertório dinâmico e músicos qualificados.',
    },
    {
      id: 'cl-2',
      titulo: 'CLÁUSULA 2ª - DA SEGURANÇA E AMBIENTE',
      conteudo:
        'O CONTRATANTE responsabiliza-se pela integridade física dos músicos e pela segurança dos instrumentos e equipamentos de som durante toda a permanência no local da apresentação.',
    },
    {
      id: 'cl-3',
      titulo: 'CLÁUSULA 3ª - DA ENERGIA ELÉTRICA E ESTRUTURA',
      conteudo:
        'O CONTRATANTE disponibilizará ponto de energia dimensionado e seguro para ligação dos equipamentos de palco, bem como proteção integral contra chuva e sol.',
    },
    {
      id: 'cl-4',
      titulo: 'CLÁUSULA 4ª - DO PAGAMENTO',
      conteudo:
        'O pagamento dar-se-á com sinal de entrada para garantia de agenda e quitação final antes da apresentação ou imediatamente após o término do evento através de transferência bancária via PIX.',
    },
    {
      id: 'cl-5',
      titulo: 'CLÁUSULA 5ª - DO FORO',
      conteudo:
        'Fica eleito o foro da Comarca do local da prestação do serviço para solução de controvérsias.',
    },
  ],

  corporativo: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DA PRESTAÇÃO DOS SERVIÇOS',
      conteudo:
        'A CONTRATADA prestará serviços musicais em evento corporativo organizado pelo CONTRATANTE, obedecendo rigorosamente à pontualidade, código de vestimenta profissional e volume sonoro adequado ao perfil corporativo.',
    },
    {
      id: 'cl-2',
      titulo: 'CLÁUSULA 2ª - DA EMISSÃO DE NOTAS E COMPROVANTES',
      conteudo:
        'O pagamento será realizado mediante apresentação de dados bancários/recibo ou nota fiscal conforme acordado, respeitando as condições de vencimento pactuadas.',
    },
    {
      id: 'cl-3',
      titulo: 'CLÁUSULA 3ª - DO RIDER TÉCNICO',
      conteudo:
        'A montagem e passagem de som ocorrerão em conformidade com o cronograma geral da convenção/evento empresarial, com técnicos e roadies credenciados.',
    },
    {
      id: 'cl-4',
      titulo: 'CLÁUSULA 4ª - DO FORO',
      conteudo:
        'As partes elegem o foro da Comarca do evento para dirimir quaisquer pendências decorrentes do presente contrato.',
    },
  ],

  geral: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DO OBJETO',
      conteudo:
        'Prestação de serviços artísticos musicais ao vivo com músicos e repertório contratados para a data estipulada.',
    },
    {
      id: 'cl-2',
      titulo: 'CLÁUSULA 2ª - DAS OBRIGAÇÕES MÚTUAS',
      conteudo:
        'A BANDA compromete-se com a pontualidade e execução artística profissional. O CONTRATANTE compromete-se com a infraestrutura, fornecimento de energia adequada e cumprimento dos prazos financeiros.',
    },
    {
      id: 'cl-3',
      titulo: 'CLÁUSULA 3ª - DAS PENALIDADES',
      conteudo:
        'O descumprimento das cláusulas sujeitará a parte infratora à multa de 20% sobre o valor total do contrato, além de perdas e danos comprovados.',
    },
    {
      id: 'cl-4',
      titulo: 'CLÁUSULA 4ª - DO FORO',
      conteudo:
        'Fica eleito o foro da Comarca de realização do evento para dirimir eventuais litígios.',
    },
  ],
}

class ContratoService {
  private getStorage(): Contrato[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler contratos do localStorage:', e)
    }
    return []
  }

  private setStorage(contratos: Contrato[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos))
    } catch (e) {
      console.error('Erro ao salvar contratos no localStorage:', e)
    }
  }

  async listarTodos(): Promise<Contrato[]> {
    return this.getStorage()
  }

  async buscarPorId(id: string): Promise<Contrato | null> {
    const list = this.getStorage()
    return list.find((c) => c.id === id) || null
  }

  async salvar(payload: NovoContratoPayload): Promise<Contrato> {
    const list = this.getStorage()
    const now = new Date().toISOString()
    const novo: Contrato = {
      ...payload,
      id: `ctr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [novo, ...list]
    this.setStorage(updated)
    return novo
  }

  async atualizar(id: string, payload: Partial<NovoContratoPayload>): Promise<Contrato | null> {
    const list = this.getStorage()
    const index = list.findIndex((c) => c.id === id)
    if (index === -1) return null

    const updatedContrato: Contrato = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    list[index] = updatedContrato
    this.setStorage(list)
    return updatedContrato
  }

  async excluir(id: string): Promise<boolean> {
    const list = this.getStorage()
    const filtered = list.filter((c) => c.id !== id)
    this.setStorage(filtered)
    return true
  }

  // Gera contrato pré-preenchido a partir dos dados do Evento da Agenda
  gerarContratoDeEvento(evento: Evento, modelo: ModeloContrato = 'casamento'): NovoContratoPayload {
    const clausulas = MODELOS_CLAUSULAS[modelo] || MODELOS_CLAUSULAS.casamento
    const valorRestante = Math.max(0, evento.cacheTotal - evento.valorSinal)
    const numeroGerado = `SF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const duracaoTexto = `${Math.floor(evento.tempoShowMinutos / 60)}h${
      evento.tempoShowMinutos % 60 ? (evento.tempoShowMinutos % 60) + 'min' : ''
    } (${evento.numeroSets} sets de show com intervalo de ${evento.intervaloMinutos}min)`

    return {
      numeroContrato: numeroGerado,
      eventoId: evento.id,
      modelo,
      status: 'rascunho',
      contratante: {
        nome: evento.contratanteNome,
        cpfCnpj: evento.contratanteDocumento || '',
        telefone: evento.contratanteTelefone,
        email: evento.contratanteEmail || '',
        enderecoCompleto: evento.endereco,
        cidade: evento.cidade,
        estado: evento.estado,
      },
      contratado: {
        nomeBanda: 'StageFlow Band (Mauricio G. Oliveira & Banda)',
        representanteNome: 'Mauricio G. Oliveira',
        cpfRepresentante: '000.000.000-00',
        telefone: '(11) 99999-9999',
        email: 'mauriciogoulart.deoliveira37@gmail.com',
        chavePix: evento.chavePixPagamento || 'mauriciogoulart.deoliveira37@gmail.com',
      },
      detalhesShow: {
        data: evento.data,
        localNome: evento.localNome,
        enderecoShow: `${evento.endereco} - ${evento.cidade}/${evento.estado}`,
        cidadeShow: evento.cidade,
        horarioChegadaMontagem: evento.horarioMontagem,
        horarioPassagemSom: evento.horarioPassagemSom,
        horarioInicioShow: evento.horarioInicioShow,
        duracaoShow: duracaoTexto,
        formacaoBanda: `Banda completa (${evento.musicosEscalados.length || 5} músicos)`,
      },
      financeiro: {
        valorTotal: evento.cacheTotal,
        valorSinal: evento.valorSinal,
        dataVencimentoSinal: evento.dataVencimentoSinal || evento.data,
        valorRestante,
        dataVencimentoRestante: evento.data,
        formaPagamento: evento.formaPagamento === 'pix' ? 'Transferência instantânea via PIX' : evento.formaPagamento,
        chavePix: evento.chavePixPagamento || 'mauriciogoulart.deoliveira37@gmail.com',
        beneficiarioPix: 'Mauricio G. Oliveira (Direção Musical)',
      },
      clausulas,
      observacoesAdicionais: evento.observacoes || '',
    }
  }

  // Exportar dados do contrato em formato JSON
  exportarJSON(contrato: Contrato): string {
    return JSON.stringify(contrato, null, 2)
  }

  // Importar dados de arquivo JSON
  importarJSON(jsonStr: string): NovoContratoPayload {
    const parsed = JSON.parse(jsonStr)
    const { id: _, createdAt: __, updatedAt: ___, ...payload } = parsed
    void _
    void __
    void ___
    return payload as NovoContratoPayload
  }
}

export const contratoService = new ContratoService()
