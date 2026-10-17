import { bandaConfigService } from './bandaConfigService'

export interface PressKitData {
  nomeBanda: string
  slogan: string
  generos: string[]
  cidadeOrigem: string
  anoFundacao: string
  releaseBiografia: string
  formacaoPalco: {
    musicos: number
    equipeTecnica: number
    descricao: string
    integrantes: { funcao: string; instrumento: string }[]
  }
  riderTecnico: {
    canaisInput: { canal: number; descricao: string; tipoMicOuDi: string }[]
    energiaEletrica: string
    dimensoesPalcoMinimo: string
    sistemaMonitoracao: string
  }
  repertorioDestaques: string[]
  linksOficiais: {
    instagram: string
    youtube: string
    spotify: string
    whatsappContato: string
  }
  fotosPromocionais: { titulo: string; url: string; descricao: string }[]
}

const STORAGE_KEY = 'stageflow_presskit_v1'

const DEFAULT_PRESSKIT: PressKitData = {
  nomeBanda: bandaConfigService.getConfig().nomeBanda,
  slogan: 'Energia ao vivo, repertório vibrante e excelência para celebrar momentos inesquecíveis.',
  generos: ['Pop Rock Nacional & Internacional', 'Clássicos dos Anos 80 & 90', 'Dance & Hits Atuais', 'Baladas Acústicas'],
  cidadeOrigem: 'São Paulo - SP',
  anoFundacao: '2024',
  releaseBiografia: `Formada por músicos experientes da cena paulistana, a banda une versatilidade técnica, som encorpado e uma interação contagiante com a pista de dança. 

Com uma formação enxuta e poderosa composta por 4 músicos no palco (Voz/Violão, Guitarra, Baixo e Bateria) acompanhada por suporte técnico dedicado (Roadie), o grupo entrega um show completo com dinâmica perfeita para casamentos, festas particulares e grandes eventos corporativos.

O repertório é pensado sob medida para cada público, mesclando desde hinos clássicos do rock e pop até os sucessos mais dançantes das últimas décadas, garantindo pista cheia do primeiro ao último acorde.`,
  formacaoPalco: {
    musicos: 4,
    equipeTecnica: 1,
    descricao: '4 Músicos no Palco + 1 Roadie / Apoio de Produção',
    integrantes: [
      { funcao: 'Frontman', instrumento: 'Voz Principal & Violão' },
      { funcao: 'Harmonia & Solos', instrumento: 'Guitarra & Backing Vocal' },
      { funcao: 'Groove & Direção Musical', instrumento: 'Baixo Elétrico & Backing' },
      { funcao: 'Ritmo & Dinâmica', instrumento: 'Bateria & Click' },
      { funcao: 'Equipe de Apoio', instrumento: 'Roadie / Passagem de Som' },
    ],
  },
  riderTecnico: {
    canaisInput: [
      { canal: 1, descricao: 'Voz Principal', tipoMicOuDi: 'Shure Beta 58A (Próprio)' },
      { canal: 2, descricao: 'Violão Eletroacústico', tipoMicOuDi: 'Direct Box Ativo (Próprio)' },
      { canal: 3, descricao: 'Guitarra Elétrica', tipoMicOuDi: 'D.I. / Simulador de Gabinete' },
      { canal: 4, descricao: 'Baixo Elétrico', tipoMicOuDi: 'Direct Box Balanceado' },
      { canal: 5, descricao: 'Bateria - Bumbo', tipoMicOuDi: 'Microfone Dinâmico Shure' },
      { canal: 6, descricao: 'Bateria - Caixa / Over', tipoMicOuDi: 'Shure SM57 / Condenser' },
      { canal: 7, descricao: 'Backing Vocal Guitarra', tipoMicOuDi: 'Shure SM58 (Próprio)' },
      { canal: 8, descricao: 'Backing Vocal Baixo', tipoMicOuDi: 'Shure SM58 (Próprio)' },
    ],
    energiaEletrica: '2 pontos de 110v ou 220v com aterramento seguro a até 8 metros do palco.',
    dimensoesPalcoMinimo: '4 metros de largura x 3 metros de profundidade.',
    sistemaMonitoracao: 'Sistema próprio de fones In-Ear sem fio (palco silencioso, sem ruído residual).',
  },
  repertorioDestaques: [
    'Queen, Bon Jovi, The Beatles, U2 e Coldplay',
    'Lulu Santos, Paralamas, Barão Vermelho, Skank e Jota Quest',
    'Tim Maia, Jorge Ben Jor e clássicos dançantes',
    'Hits pop contemporâneos para abertura de pista',
  ],
  linksOficiais: {
    instagram: 'https://instagram.com/banda_oficial',
    youtube: 'https://youtube.com/@banda_oficial',
    spotify: 'https://spotify.com/artist/banda',
    whatsappContato: '(11) 99999-9999',
  },
  fotosPromocionais: [
    {
      titulo: 'Show ao Vivo / Palco',
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
      descricao: 'Apresentação com energia total e iluminação de palco',
    },
    {
      titulo: 'Formação da Banda',
      url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
      descricao: 'Integrantes no palco e conexão com o público',
    },
  ],
}

class PressKitService {
  getData(): PressKitData {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error('Erro ao ler press kit do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRESSKIT))
    return DEFAULT_PRESSKIT
  }

  saveData(newData: Partial<PressKitData>): PressKitData {
    try {
      const current = this.getData()
      const updated = { ...current, ...newData }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    } catch (e) {
      console.error('Erro ao salvar press kit:', e)
      return { ...DEFAULT_PRESSKIT, ...newData }
    }
  }

  gerarTextoWhatsApp(data: PressKitData): string {
    return `🔥 *PRESS KIT OFICIAL • ${data.nomeBanda}* 🔥

Olá! Segue o material promocional oficial da *${data.nomeBanda}* para avaliação de shows e eventos:

🎸 *Estilo Musical:* ${data.generos.join(' • ')}
📍 *Origem:* ${data.cidadeOrigem}
👥 *Formação:* ${data.formacaoPalco.descricao}

🎤 *Sobre a Banda:*
${data.releaseBiografia.slice(0, 320)}...

🎶 *Destaques do Repertório:*
${data.repertorioDestaques.map((h) => `• ${h}`).join('\n')}

🔊 *Infraestrutura:*
${data.riderTecnico.sistemaMonitoracao}

📲 *Contatos & Mídias:*
• WhatsApp Produção: ${data.linksOficiais.whatsappContato}
• Instagram: ${data.linksOficiais.instagram}
• Vídeos no YouTube: ${data.linksOficiais.youtube}

Estamos à disposição para enviar proposta e verificar disponibilidade de agenda! 🚀`
  }
}

export const pressKitService = new PressKitService()
