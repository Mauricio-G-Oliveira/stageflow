import { bandaConfigService } from './bandaConfigService'

export interface CanalInputRider {
  canal: number
  descricao: string
  tipoMicOuDi: string
  pedestal?: string
}

export interface PressKitData {
  nomeBanda: string
  slogan: string
  generos: string[]
  cidadeOrigem: string
  anoFundacao: string
  fotoBandaUrl: string
  driveMaterialUrl: string // Link do Google Drive com vídeos, fotos em alta, logos e flyers
  releaseBiografia: string
  formacaoPalco: {
    musicos: number
    equipeTecnica: number
    descricao: string
    integrantes: { funcao: string; instrumento: string }[]
  }
  repertorioDestaques: string[]
  linksOficiais: {
    instagram: string
    youtube: string
    spotify: string
    whatsappContato: string
  }
  // Rider Técnico (Aba separada para quando o som for contratado por terceiros)
  riderTecnico: {
    observacaoUso: string
    canaisInput: CanalInputRider[]
    exigenciasPaSom: string
    mesaDigitalExigida: string
    sistemaMonitoracao: string
    energiaEletrica: string
    dimensoesPalcoMinimo: string
    bateriaExigencia: string
  }
}

const STORAGE_KEY = 'stageflow_presskit_v2'

const DEFAULT_PRESSKIT: PressKitData = {
  nomeBanda: bandaConfigService.getConfig().nomeBanda,
  slogan: 'Energia ao vivo, versatilidade de repertório e momentos inesquecíveis.',
  generos: ['Pop Rock Nacional & Internacional', 'Hits dos Anos 80 & 90', 'Flashback & Dance', 'Baladas Acústicas'],
  cidadeOrigem: 'São Paulo - SP',
  anoFundacao: '2024',
  fotoBandaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
  driveMaterialUrl: 'https://drive.google.com/drive/folders/exemplo_banda_videos_e_artes',
  releaseBiografia: `Criada com a proposta de elevar o nível de entretenimento musical ao vivo, a banda une versatilidade, presença de palco marcante e uma conexão genuína com o público.

Inspirada no formato dinâmico e de alta entrega de bandas baile consagradas, a formação de 4 músicos no palco (Voz/Violão, Guitarra, Baixo e Bateria) acompanhada de equipe técnica dedicada (Roadie) permite um show dinâmico, sem pausas desnecessárias e com repertório flexível.

Do início intimista de recepção até o ápice da pista de dança, o repertório passeia pelos maiores hinos do pop rock nacional e internacional, clássicos dos anos 80/90, ritmos contagiantes e músicas que marcaram gerações — sempre com arranjos vibrantes feitos para não deixar ninguém parado.`,
  formacaoPalco: {
    musicos: 4,
    equipeTecnica: 1,
    descricao: '4 Músicos no Palco + 1 Roadie / Apoio de Produção',
    integrantes: [
      { funcao: 'Vocalista / Frontman', instrumento: 'Voz Principal & Violão' },
      { funcao: 'Guitarrista', instrumento: 'Guitarra Solo, Base & Backing Vocal' },
      { funcao: 'Baixista & Direção', instrumento: 'Baixo Elétrico & Backing Vocal' },
      { funcao: 'Baterista', instrumento: 'Bateria, Metrônomo/Click & Samplers' },
      { funcao: 'Suporte de Palco', instrumento: 'Roadie / Montagem & Apoio Técnico' },
    ],
  },
  repertorioDestaques: [
    'Rock & Pop Internacional: Queen, Bon Jovi, The Beatles, U2, Coldplay, Bruno Mars',
    'Pop Rock Nacional: Lulu Santos, Paralamas do Sucesso, Barão Vermelho, Skank, Jota Quest, Capital Inicial',
    'Flashback & Soul: Tim Maia, Jorge Ben Jor, Michael Jackson, Earth Wind & Fire',
    'Hits para Pista de Dança: Seleção dinâmica adaptada ao perfil dos convidados',
  ],
  linksOficiais: {
    instagram: 'https://instagram.com/banda_oficial',
    youtube: 'https://youtube.com/@banda_oficial',
    spotify: 'https://spotify.com/artist/banda',
    whatsappContato: '(11) 99999-9999',
  },
  riderTecnico: {
    observacaoUso: 'Este rider é aplicável exclusivamente quando a estrutura de som e iluminação for fornecida por empresa terceirizada ou pelo contratante do evento. Nos demais shows, a banda utiliza seu próprio sistema patrimonial de áudio.',
    exigenciasPaSom: 'Sistema de P.A. estéreo (Line Array ou Caixas Ativas de alta performance + Subwoofers) dimensionado para cobertura uniforme do público com SPL mínimo de 105 dB no centro da pista, livre de distorção.',
    mesaDigitalExigida: 'Mesa de Som Digital (Behringer X32, Midas M32, Yamaha TF/CL ou similar) com no mínimo 16 canais livres e conectividade para roteador Wi-Fi 5GHz para mixagem de fones in-ear.',
    sistemaMonitoracao: 'A banda utiliza sistema próprio de fones In-Ear sem fio (4 vias estéreo independentes). A empresa de som deve fornecer as saídas auxiliares XLR balanceadas correspondentes.',
    energiaEletrica: '2 pontos independentes de energia elétrica estabilizada e devidamente aterrada (110v ou 220v identificado) a no máximo 5 metros do palco.',
    dimensoesPalcoMinimo: 'Palco ou espaço nivelado e coberto com dimensões mínimas de 5m de largura x 3m de profundidade.',
    bateriaExigencia: 'Praticável para bateria de no mínimo 2m x 2m com carpete antiderrapante, além de kit completo de microfones para bateria (bumbo, caixa, chimbal, 2 tons, surdo e 2 overs).',
    canaisInput: [
      { canal: 1, descricao: 'Voz Principal', tipoMicOuDi: 'Shure Beta 58A (Próprio da banda)', pedestal: 'Pedestal Girafa' },
      { canal: 2, descricao: 'Violão Eletroacústico', tipoMicOuDi: 'Direct Box Ativo (Próprio)', pedestal: '—' },
      { canal: 3, descricao: 'Guitarra Elétrica', tipoMicOuDi: 'Direct Box / Emulador XLR', pedestal: '—' },
      { canal: 4, descricao: 'Baixo Elétrico', tipoMicOuDi: 'Direct Box Ativo Balanceado', pedestal: '—' },
      { canal: 5, descricao: 'Backing Vocal Guitarra', tipoMicOuDi: 'Shure SM58', pedestal: 'Pedestal Girafa' },
      { canal: 6, descricao: 'Backing Vocal Baixo', tipoMicOuDi: 'Shure SM58', pedestal: 'Pedestal Girafa' },
      { canal: 7, descricao: 'Bateria - Bumbo', tipoMicOuDi: 'Shure Beta 52A ou AKG D112', pedestal: 'Pedestal Baixo' },
      { canal: 8, descricao: 'Bateria - Caixa Superior', tipoMicOuDi: 'Shure SM57', pedestal: 'Garra / Pedestal Pequeno' },
      { canal: 9, descricao: 'Bateria - Tom 1', tipoMicOuDi: 'Sennheiser e604 ou Shure SM57', pedestal: 'Garra' },
      { canal: 10, descricao: 'Bateria - Surdo', tipoMicOuDi: 'Sennheiser e604 ou Shure SM57', pedestal: 'Garra' },
      { canal: 11, descricao: 'Bateria - Over L (Pratos)', tipoMicOuDi: 'Condenser (AKG C414 ou similar)', pedestal: 'Pedestal Girafa Alto' },
      { canal: 12, descricao: 'Bateria - Over R (Pratos)', tipoMicOuDi: 'Condenser (AKG C414 ou similar)', pedestal: 'Pedestal Girafa Alto' },
    ],
  },
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
    return `🔥 *MATERIAL DE APRESENTAÇÃO • ${data.nomeBanda}* 🔥

Olá! Tudo bem? Segue a apresentação oficial da *${data.nomeBanda}* para o seu evento:

🎸 *Estilo Musical:* ${data.generos.join(' • ')}
📍 *Origem:* ${data.cidadeOrigem}
👥 *Formação:* ${data.formacaoPalco.descricao}

🎤 *Sobre o Show:*
${data.releaseBiografia.slice(0, 280)}...

🎶 *Destaques do Repertório:*
${data.repertorioDestaques.slice(0, 3).map((h) => `• ${h}`).join('\n')}

📁 *VÍDEOS, FOTOS & MATERIAL NO GOOGLE DRIVE:*
Acesse nossa pasta oficial com vídeos ao vivo dos shows, fotos em alta resolução, logo transparente e artes para flyers:
👉 ${data.driveMaterialUrl}

📲 *Contratação de Shows:*
WhatsApp Produção: ${data.linksOficiais.whatsappContato}
Instagram: ${data.linksOficiais.instagram}

Ficamos à disposição para montar a proposta perfeita para o seu evento! 🚀`
  }

  gerarTextoRiderWhatsApp(data: PressKitData): string {
    return `🎛️ *RIDER TÉCNICO & MAPA DE ÁUDIO • ${data.nomeBanda}* 🎛️
*(Para uso exclusivo da equipe técnica de som contratada por terceiros)*

👥 *Formação de Palco:* 4 Músicos (Voz, Guitarra, Baixo, Bateria) + 1 Roadie
📍 *Origem:* ${data.cidadeOrigem}

🔊 *Sistema de P.A.:*
${data.riderTecnico.exigenciasPaSom}

🎚️ *Mesa de Som & Monitoração:*
• ${data.riderTecnico.mesaDigitalExigida}
• ${data.riderTecnico.sistemaMonitoracao}

⚡ *Energia Elétrica & Palco:*
• ${data.riderTecnico.energiaEletrica}
• Dimensões mínimas: ${data.riderTecnico.dimensoesPalcoMinimo}
• ${data.riderTecnico.bateriaExigencia}

📋 *Input List (Canais principais):*
${data.riderTecnico.canaisInput.slice(0, 8).map((ch) => `Ch ${ch.canal} - ${ch.descricao} (${ch.tipoMicOuDi})`).join('\n')}

Dúvidas técnicas com o líder da banda: ${data.linksOficiais.whatsappContato}`
  }
}

export const pressKitService = new PressKitService()
