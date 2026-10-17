import type { Contrato, ModeloContrato, NovoContratoPayload, ClausulaContratual } from '../types/contrato'
import type { Evento } from '../types/evento'
import { bandaConfigService } from './bandaConfigService'

const STORAGE_KEY = 'stageflow_contratos_v2'

export const MODELOS_CLAUSULAS: Record<ModeloContrato, ClausulaContratual[]> = {
  banda_sem_nome: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DO OBJETO E IDENTIFICAÇÃO DA ATRAÇÃO MUSICAL',
      conteudo:
        'O presente contrato tem por objeto a realização de apresentação musical ao vivo pela CONTRATADA, grupo musical atualmente sob denominação artística provisória de "[NOME DA BANDA]", representado por sua direção musical, composto por 4 (quatro) músicos no palco e equipe técnica/roadie de suporte, com repertório dinâmico e profissional acordado previamente entre as partes.',
    },
    {
      id: 'cl-2',
      titulo: 'CLÁUSULA 2ª - DO CRONOGRAMA, MONTAGEM E PASSAGEM DE SOM',
      conteudo:
        'A CONTRATADA compromete-se a comparecer ao local do evento com antecedência técnica estipulada para descarga, montagem de sonorização, instrumentos e passagem de som completa, antes do início da chegada dos convidados.',
    },
    {
      id: 'cl-3',
      titulo: 'CLÁUSULA 3ª - DA ESTRUTURA TÉCNICA E ENERGIA',
      conteudo:
        'O CONTRATANTE fornecerá ponto de energia elétrica aterrado e estável (110v/220v) exclusivo para os equipamentos musicais a no máximo 10 metros do palco, além de espaço físico coberto e seguro contra sol e chuva.',
    },
    {
      id: 'cl-4',
      titulo: 'CLÁUSULA 4ª - DA ALIMENTAÇÃO E CAMARIM',
      conteudo:
        'O CONTRATANTE disponibilizará alimentação e bebidas (água mineral, refrigerantes e café) a todos os 4 músicos e equipe técnica de apoio durante o período do evento.',
    },
    {
      id: 'cl-5',
      titulo: 'CLÁUSULA 5ª - DO VALOR E CONDIÇÕES DE PAGAMENTO',
      conteudo:
        'Pela prestação dos serviços artísticos, o CONTRATANTE pagará o valor estipulado em duas parcelas: 50% a título de sinal e garantia irrevogável de reserva de data, e o saldo restante impreterivelmente até a passagem de som no dia do evento.',
    },
    {
      id: 'cl-6',
      titulo: 'CLÁUSULA 6ª - DA HORA EXTRA E PRORROGAÇÃO',
      conteudo:
        'Qualquer prorrogação do horário além do contratado dependerá de comum acordo e implicará na taxa de 30% do valor total do cachê por hora adicional.',
    },
    {
      id: 'cl-7',
      titulo: 'CLÁUSULA 7ª - DO FORO',
      conteudo:
        'Fica eleito o foro da Comarca do local da apresentação para dirimir dúvidas oriundas deste contrato.',
    },
  ],

  casamento: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DO OBJETO E FORMAÇÃO',
      conteudo:
        'O presente instrumento tem como objeto a prestação de serviços artísticos e musicais para celebração matrimonial, a ser realizada pela CONTRATADA com formação ao vivo composta por 4 músicos profissionais e equipe técnica, executando repertório de alta qualidade previamente alinhado entre as partes.',
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
        'O CONTRATANTE fornecerá a infraestrutura técnica conforme o rider de som e iluminação alinhado previamente pela equipe de produção da BANDA.',
    },
    {
      id: 'cl-4',
      titulo: 'CLÁUSULA 4ª - DO FORO',
      conteudo:
        'Eleito o foro da Comarca do local da prestação do serviço.',
    },
  ],

  geral: [
    {
      id: 'cl-1',
      titulo: 'CLÁUSULA 1ª - DO OBJETO DO CONTRATO',
      conteudo:
        'O presente contrato visa à execução de apresentação musical ao vivo pela BANDA CONTRATADA em favor do CONTRATANTE, na data, horário e local previamente estabelecidos.',
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

    // Contrato modelo inicial pronto para a banda sem nome ainda
    const bandaConfig = bandaConfigService.getConfig()
    const defaultContrato: Contrato = {
      id: 'ctr-demo-1',
      numeroContrato: `CTR-${new Date().getFullYear()}/001`,
      modelo: 'banda_sem_nome',
      status: 'emitido',
      contratante: {
        nome: 'Juliana Mendes & Rafael Costa',
        cpfCnpj: '123.456.789-00',
        telefone: '(11) 98765-4321',
        email: 'juliana.mendes@exemplo.com',
        enderecoCompleto: 'Av. Paulista, 1000 - Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
      contratado: {
        nomeBanda: bandaConfig.nomeBanda,
        representanteNome: bandaConfig.responsavelNome,
        cpfRepresentante: bandaConfig.responsavelCpf,
        telefone: bandaConfig.responsavelTelefone,
        email: bandaConfig.responsavelEmail,
        chavePix: bandaConfig.chavePix,
      },
      detalhesShow: {
        data: '2024-11-23',
        localNome: 'Espaço Villa Bisutti',
        enderecoShow: 'Rua Principal, 500 - Vila Olímpia',
        cidadeShow: 'São Paulo - SP',
        horarioChegadaMontagem: '17:30',
        horarioPassagemSom: '19:00',
        horarioInicioShow: '21:30',
        duracaoShow: '3 horas de apresentação (2 sets de 1h20)',
        formacaoBanda: 'Banda completa com 4 músicos no palco + 1 roadie de suporte',
      },
      financeiro: {
        valorTotal: 5500,
        valorSinal: 2750,
        dataVencimentoSinal: '2024-11-10',
        valorRestante: 2750,
        dataVencimentoRestante: '2024-11-23',
        formaPagamento: '50% sinal na assinatura via Pix + 50% na passagem de som',
        chavePix: bandaConfig.chavePix,
        beneficiarioPix: bandaConfig.responsavelNome,
      },
      clausulas: MODELOS_CLAUSULAS.banda_sem_nome,
      observacoesAdicionais: 'Apresentação com som e iluminação cênica de palco próprios da banda.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultContrato]))
    return [defaultContrato]
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
  gerarContratoDeEvento(evento: Evento, modelo: ModeloContrato = 'banda_sem_nome'): NovoContratoPayload {
    const clausulas = MODELOS_CLAUSULAS[modelo] || MODELOS_CLAUSULAS.banda_sem_nome
    const valorRestante = Math.max(0, evento.cacheTotal - evento.valorSinal)
    const numeroGerado = `CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const bandaConfig = bandaConfigService.getConfig()

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
        nomeBanda: bandaConfig.nomeBanda,
        representanteNome: bandaConfig.responsavelNome,
        cpfRepresentante: bandaConfig.responsavelCpf,
        telefone: bandaConfig.responsavelTelefone,
        email: bandaConfig.responsavelEmail,
        chavePix: evento.chavePixPagamento || bandaConfig.chavePix,
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
        formacaoBanda: `Banda completa (4 músicos no palco + 1 roadie de apoio)`,
      },
      financeiro: {
        valorTotal: evento.cacheTotal,
        valorSinal: evento.valorSinal,
        dataVencimentoSinal: evento.dataVencimentoSinal || evento.data,
        valorRestante,
        dataVencimentoRestante: evento.data,
        formaPagamento: evento.formaPagamento === 'pix' ? 'Transferência instantânea via PIX' : evento.formaPagamento,
        chavePix: evento.chavePixPagamento || bandaConfig.chavePix,
        beneficiarioPix: `${bandaConfig.responsavelNome} (Direção Musical)`,
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
