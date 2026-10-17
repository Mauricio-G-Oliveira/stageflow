export interface BandaConfig {
  nomeBanda: string
  generoMusical: string
  cidadeEstado: string
  slogan: string
  responsavelNome: string
  responsavelCpf: string
  responsavelTelefone: string
  responsavelEmail: string
  chavePix: string
  bancoPix: string
  formacaoDescricao: string
  tempoMedioShow: string
  instagram: string
  youtube: string
  spotify: string
  logoUrl?: string
}

const STORAGE_KEY = 'stageflow_banda_config_v1'

const DEFAULT_CONFIG: BandaConfig = {
  nomeBanda: '[NOME DA BANDA]',
  generoMusical: 'Pop Rock, Clássicos & Ritmos Variados',
  cidadeEstado: 'São Paulo - SP',
  slogan: 'Show ao vivo de alta energia para eventos, festas e celebrações.',
  responsavelNome: 'Mauricio G. Oliveira',
  responsavelCpf: '000.000.000-00',
  responsavelTelefone: '(11) 99999-9999',
  responsavelEmail: 'mauriciogoulart.deoliveira37@gmail.com',
  chavePix: 'mauriciogoulart.deoliveira37@gmail.com',
  bancoPix: 'Nubank / Banco do Brasil',
  formacaoDescricao: 'Banda completa com 4 músicos + 1 roadie/equipe técnica',
  tempoMedioShow: '2 a 3 horas de apresentação (com intervalos combinados)',
  instagram: '@banda_oficial',
  youtube: 'https://youtube.com/@banda_oficial',
  spotify: 'https://spotify.com/artist/banda',
}

class BandaConfigService {
  getConfig(): BandaConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(data) }
      }
    } catch (e) {
      console.error('Erro ao ler configurações da banda do localStorage:', e)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG))
    return DEFAULT_CONFIG
  }

  saveConfig(newConfig: Partial<BandaConfig>): BandaConfig {
    try {
      const current = this.getConfig()
      const updated = { ...current, ...newConfig }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    } catch (e) {
      console.error('Erro ao salvar configurações da banda:', e)
      return { ...DEFAULT_CONFIG, ...newConfig }
    }
  }
}

export const bandaConfigService = new BandaConfigService()
