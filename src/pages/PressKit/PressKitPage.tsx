import { useState, useEffect, type FormEvent } from 'react'
import {
  Sparkles,
  Printer,
  Edit2,
  CheckCircle2,
  Users,
  Music2,
  SlidersHorizontal,
  X,
  MapPin,
  Check,
  Copy,
  Radio,
  FolderOpen,
  Volume2,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import { pressKitService, type PressKitData, type CanalInputRider } from '../../services/pressKitService'
import { bandaConfigService } from '../../services/bandaConfigService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  )
}

type TabType = 'presskit' | 'rider'

export function PressKitPage() {
  const [data, setData] = useState<PressKitData>(pressKitService.getData())
  const [activeTab, setActiveTab] = useState<TabType>('presskit')
  const [isEditing, setIsEditing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedDrive, setCopiedDrive] = useState(false)

  // Edit State - Press Kit
  const [nomeBanda, setNomeBanda] = useState(data.nomeBanda)
  const [slogan, setSlogan] = useState(data.slogan)
  const [cidadeOrigem, setCidadeOrigem] = useState(data.cidadeOrigem)
  const [fotoBandaUrl, setFotoBandaUrl] = useState(data.fotoBandaUrl)
  const [driveMaterialUrl, setDriveMaterialUrl] = useState(data.driveMaterialUrl)
  const [releaseBiografia, setReleaseBiografia] = useState(data.releaseBiografia)
  const [whatsappContato, setWhatsappContato] = useState(data.linksOficiais.whatsappContato)
  const [instagram, setInstagram] = useState(data.linksOficiais.instagram)
  const [youtube, setYoutube] = useState(data.linksOficiais.youtube)

  // Edit State - Rider Técnico
  const [exigenciasPaSom, setExigenciasPaSom] = useState(data.riderTecnico.exigenciasPaSom)
  const [mesaDigitalExigida, setMesaDigitalExigida] = useState(data.riderTecnico.mesaDigitalExigida)
  const [sistemaMonitoracao, setSistemaMonitoracao] = useState(data.riderTecnico.sistemaMonitoracao)
  const [energiaEletrica, setEnergiaEletrica] = useState(data.riderTecnico.energiaEletrica)
  const [dimensoesPalcoMinimo, setDimensoesPalcoMinimo] = useState(data.riderTecnico.dimensoesPalcoMinimo)
  const [bateriaExigencia, setBateriaExigencia] = useState(data.riderTecnico.bateriaExigencia)
  const [canaisInput, setCanaisInput] = useState<CanalInputRider[]>(data.riderTecnico.canaisInput)

  useEffect(() => {
    setData(pressKitService.getData())
  }, [])

  const handleCopyWhatsApp = () => {
    const texto =
      activeTab === 'presskit'
        ? pressKitService.gerarTextoWhatsApp(data)
        : pressKitService.gerarTextoRiderWhatsApp(data)

    navigator.clipboard.writeText(texto)
    setCopied(true)
    setNotification(
      activeTab === 'presskit'
        ? 'Texto do Press Kit com link do Google Drive copiado! Cole no WhatsApp do contratante.'
        : 'Texto do Rider Técnico copiado! Cole no WhatsApp da equipe de áudio.',
    )
    setTimeout(() => {
      setCopied(false)
      setNotification(null)
    }, 4000)
  }

  const handleCopyDriveLink = () => {
    navigator.clipboard.writeText(data.driveMaterialUrl)
    setCopiedDrive(true)
    setNotification('Link da pasta do Google Drive copiado!')
    setTimeout(() => {
      setCopiedDrive(false)
      setNotification(null)
    }, 3000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleOpenEditModal = () => {
    setNomeBanda(data.nomeBanda)
    setSlogan(data.slogan)
    setCidadeOrigem(data.cidadeOrigem)
    setFotoBandaUrl(data.fotoBandaUrl)
    setDriveMaterialUrl(data.driveMaterialUrl)
    setReleaseBiografia(data.releaseBiografia)
    setWhatsappContato(data.linksOficiais.whatsappContato)
    setInstagram(data.linksOficiais.instagram)
    setYoutube(data.linksOficiais.youtube)

    setExigenciasPaSom(data.riderTecnico.exigenciasPaSom)
    setMesaDigitalExigida(data.riderTecnico.mesaDigitalExigida)
    setSistemaMonitoracao(data.riderTecnico.sistemaMonitoracao)
    setEnergiaEletrica(data.riderTecnico.energiaEletrica)
    setDimensoesPalcoMinimo(data.riderTecnico.dimensoesPalcoMinimo)
    setBateriaExigencia(data.riderTecnico.bateriaExigencia)
    setCanaisInput([...data.riderTecnico.canaisInput])

    setIsEditing(true)
  }

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault()

    const updated = pressKitService.saveData({
      nomeBanda: nomeBanda.trim(),
      slogan: slogan.trim(),
      cidadeOrigem: cidadeOrigem.trim(),
      fotoBandaUrl: fotoBandaUrl.trim(),
      driveMaterialUrl: driveMaterialUrl.trim(),
      releaseBiografia: releaseBiografia.trim(),
      linksOficiais: {
        ...data.linksOficiais,
        whatsappContato: whatsappContato.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
      riderTecnico: {
        ...data.riderTecnico,
        exigenciasPaSom: exigenciasPaSom.trim(),
        mesaDigitalExigida: mesaDigitalExigida.trim(),
        sistemaMonitoracao: sistemaMonitoracao.trim(),
        energiaEletrica: energiaEletrica.trim(),
        dimensoesPalcoMinimo: dimensoesPalcoMinimo.trim(),
        bateriaExigencia: bateriaExigencia.trim(),
        canaisInput,
      },
    })

    // Sync central band config
    bandaConfigService.saveConfig({
      nomeBanda: nomeBanda.trim(),
      cidadeEstado: cidadeOrigem.trim(),
      responsavelTelefone: whatsappContato.trim(),
    })

    setData(updated)
    setIsEditing(false)
    setNotification('Dados atualizados com sucesso!')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddCanal = () => {
    const nextCanal = canaisInput.length + 1
    setCanaisInput([
      ...canaisInput,
      {
        canal: nextCanal,
        descricao: 'Novo Canal / Instrumento',
        tipoMicOuDi: 'Direct Box / Microfone',
        pedestal: '—',
      },
    ])
  }

  const handleRemoveCanal = (index: number) => {
    const filtered = canaisInput.filter((_, idx) => idx !== index)
    const reindexed = filtered.map((ch, idx) => ({ ...ch, canal: idx + 1 }))
    setCanaisInput(reindexed)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Tab Navigation */}
      <div className="print:hidden bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-teal-400" />
                Material Oficial & Divulgação • {data.nomeBanda}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
                Banda Única
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Apresentação comercial para clientes e rider técnico separado para eventos com som terceirizado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopyWhatsApp}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            >
              {copied ? 'Copiado!' : activeTab === 'presskit' ? 'Copiar Apresentação' : 'Copiar Rider Técnico'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-slate-300" />}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
            >
              Imprimir / PDF
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenEditModal}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Editar {activeTab === 'presskit' ? 'Press Kit' : 'Rider'}
            </Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('presskit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presskit'
                ? 'bg-[#0e6f5c] text-white shadow-md shadow-[#0e6f5c]/25'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Press Kit da Banda (Apresentação & Clientes)</span>
          </button>

          <button
            onClick={() => setActiveTab('rider')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rider'
                ? 'bg-[#0e6f5c] text-white shadow-md shadow-[#0e6f5c]/25'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>2. Rider Técnico (Para Som Terceirizado)</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: PRESS KIT (APRESENTAÇÃO & CLIENTES - ESTILO BANDA LIVERT)
          ========================================================================= */}
      {activeTab === 'presskit' && (
        <div className="space-y-6">
          {/* Main Visual Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0">
            {/* Hero Cover Card with Photo & Brand Identity */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#0e6f5c] via-[#0b483c] to-slate-950 overflow-hidden text-white border border-teal-500/30 shadow-lg print:border-slate-300 print:bg-teal-900">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-8">
                {/* Band Photo */}
                <div className="md:col-span-5 relative group">
                  <div className="aspect-4/3 rounded-xl overflow-hidden border-2 border-teal-400/30 shadow-2xl bg-slate-950">
                    <img
                      src={data.fotoBandaUrl}
                      alt={data.nomeBanda}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-teal-200 text-center font-medium">
                    Foto Promocional Oficial
                  </div>
                </div>

                {/* Text Presentation */}
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-teal-200 border border-white/20 inline-block">
                    Apresentação Artística & Musical
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {data.nomeBanda}
                  </h2>

                  <p className="text-sm sm:text-base text-teal-100 leading-relaxed font-medium">
                    {data.slogan}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {data.generos.map((gen, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-black/30 border border-white/15 text-teal-200 font-medium"
                      >
                        {gen}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200/90 pt-3 border-t border-white/15">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-teal-300" />
                      Base: <strong>{data.cidadeOrigem}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-teal-300" />
                      Formação: <strong>{data.formacaoPalco.descricao}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Drive Media Hub Card (HIGH PRIORITY) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/30 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Pasta Oficial de Mídia no Google Drive
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Vídeos & Fotos
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      Vídeos em alta definição dos shows ao vivo, fotos profissionais para divulgação, logomarca em vetor com fundo transparente e templates de flyer prontos para edição.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyDriveLink}
                    leftIcon={copiedDrive ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedDrive ? 'Link Copiado!' : 'Copiar Link'}
                  </Button>

                  <a
                    href={data.driveMaterialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e6f5c] hover:bg-[#128a73] text-white text-xs font-bold transition-all shadow-md shadow-[#0e6f5c]/25"
                  >
                    <span>Acessar Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-mono truncate">
                {data.driveMaterialUrl}
              </div>
            </div>

            {/* Biografia / Release Oficial */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
                <Radio className="w-4 h-4" /> História & Release Oficial da Banda
              </h3>
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line print:bg-slate-50 print:text-slate-800 print:border-slate-200">
                {data.releaseBiografia}
              </div>
            </div>

            {/* Formação de Palco (4 Músicos + 1 Roadie) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
                <Users className="w-4 h-4" /> Formação de Palco & Equipe ({data.formacaoPalco.descricao})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.formacaoPalco.integrantes.map((int, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center gap-3 print:bg-slate-50 print:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 print:bg-teal-100 print:text-teal-900">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block print:text-slate-600">
                        {int.funcao}
                      </span>
                      <strong className="text-xs text-white print:text-slate-900">{int.instrumento}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destaques do Repertório */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
                <Music2 className="w-4 h-4" /> Destaques do Repertório do Show
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.repertorioDestaques.map((rep, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200 print:bg-slate-50 print:border-slate-200 print:text-slate-900"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{rep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contratação & Redes Sociais */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-slate-100 print:border-slate-300">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white print:text-slate-900">
                  Contratação de Shows & Propostas Exclusivas
                </h4>
                <p className="text-xs text-slate-400 print:text-slate-700">
                  WhatsApp Direto da Produção:{' '}
                  <strong className="text-emerald-400 print:text-emerald-700">
                    {data.linksOficiais.whatsappContato}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {data.linksOficiais.instagram && (
                  <a
                    href={data.linksOficiais.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-teal-500/40 transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram</span>
                  </a>
                )}
                {data.linksOficiais.youtube && (
                  <a
                    href={data.linksOficiais.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-teal-500/40 transition-colors"
                  >
                    <YoutubeIcon className="w-3.5 h-3.5 text-red-400" />
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            </div>

            {/* Notice about Sound Equipment */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2.5">
              <Volume2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p>
                <strong>Estrutura de Som:</strong> Para a maioria dos shows, a banda utiliza seu próprio sistema patrimonial de som e iluminação. O Rider Técnico detalhado só é necessário caso o contratante ou festival forneça som terceirizado (consulte a aba <em>"Rider Técnico"</em>).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RIDER TÉCNICO (PARA SOM TERCEIRIZADO)
          ========================================================================= */}
      {activeTab === 'rider' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0">
            {/* Header Disclaimer Card */}
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Uso Exclusivo Para Sonorização Terceirizada</span>
              </div>
              <p>
                {data.riderTecnico.observacaoUso}
              </p>
            </div>

            {/* Input List (Canal / Descrição / Microfone / D.I.) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
                  <SlidersHorizontal className="w-4 h-4" /> Input List & Canais da Mesa Digital
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {data.riderTecnico.canaisInput.length} canais mapeados
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto print:bg-slate-50 print:border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 print:border-slate-300 print:text-slate-700">
                      <th className="py-2.5 px-3 font-semibold">Canal</th>
                      <th className="py-2.5 px-3 font-semibold">Instrumento / Sinal</th>
                      <th className="py-2.5 px-3 font-semibold">Microfone ou Direct Box</th>
                      <th className="py-2.5 px-3 font-semibold">Pedestal / Suporte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                    {data.riderTecnico.canaisInput.map((ch) => (
                      <tr key={ch.canal} className="text-slate-200 print:text-slate-900">
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-400 print:text-teal-800">
                          Ch {ch.canal < 10 ? `0${ch.canal}` : ch.canal}
                        </td>
                        <td className="py-2.5 px-3 font-semibold">{ch.descricao}</td>
                        <td className="py-2.5 px-3 text-slate-300 print:text-slate-700">
                          {ch.tipoMicOuDi}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">
                          {ch.pedestal || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technical Audio Specs Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
                <Volume2 className="w-4 h-4" /> Exigências de Sonorização & Palco
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Sistema de PA */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Volume2 className="w-4 h-4 text-teal-400" />
                    <span>Sistema de P.A. & Subwoofers</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {data.riderTecnico.exigenciasPaSom}
                  </p>
                </div>

                {/* Mesa de Som Digital */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                    <span>Mesa de Som Digital & Wi-Fi</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {data.riderTecnico.mesaDigitalExigida}
                  </p>
                </div>

                {/* Monitoração In-Ear */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Radio className="w-4 h-4 text-teal-400" />
                    <span>Sistema de Monitoração In-Ear</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {data.riderTecnico.sistemaMonitoracao}
                  </p>
                </div>

                {/* Energia Elétrica */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Alimentação Elétrica Estabilizada</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {data.riderTecnico.energiaEletrica}
                  </p>
                </div>

                {/* Palco & Bateria */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Music2 className="w-4 h-4 text-teal-400" />
                    <span>Palco & Praticável de Bateria</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {data.riderTecnico.dimensoesPalcoMinimo} • {data.riderTecnico.bateriaExigencia}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact for Sound Company */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Dúvidas Técnicas & Alinhamento de Áudio
                </span>
                <p className="text-xs text-slate-300">
                  Contato direto com a direção da banda: <strong className="text-white">{data.linksOficiais.whatsappContato}</strong>
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyWhatsApp}
                leftIcon={<Copy className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Copiar Rider p/ WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE EDIÇÃO COMPLETA (PRESS KIT & RIDER)
          ========================================================================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Editar {activeTab === 'presskit' ? 'Press Kit da Banda' : 'Rider Técnico'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Personalize os dados oficiais da sua banda.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {activeTab === 'presskit' ? (
                <>
                  <Input
                    label="Nome da Banda (ou Provisório)"
                    placeholder="Ex: [NOME DA BANDA]"
                    value={nomeBanda}
                    onChange={(e) => setNomeBanda(e.target.value)}
                    required
                  />

                  <Input
                    label="Slogan / Apresentação Resumida"
                    placeholder="Ex: Show ao vivo com os maiores clássicos do pop rock..."
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Cidade Base"
                      placeholder="Ex: São Paulo - SP"
                      value={cidadeOrigem}
                      onChange={(e) => setCidadeOrigem(e.target.value)}
                      required
                    />

                    <Input
                      label="WhatsApp de Contato para Shows"
                      placeholder="(11) 99999-9999"
                      value={whatsappContato}
                      onChange={(e) => setWhatsappContato(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Link da Pasta no Google Drive (Vídeos, Fotos e Flyers)"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveMaterialUrl}
                    onChange={(e) => setDriveMaterialUrl(e.target.value)}
                    helperText="Pasta onde os contratantes baixam vídeos de shows, fotos e artes de flyers."
                    required
                  />

                  <Input
                    label="URL da Foto Oficial da Banda"
                    placeholder="https://exemplo.com/foto-banda.jpg"
                    value={fotoBandaUrl}
                    onChange={(e) => setFotoBandaUrl(e.target.value)}
                    helperText="Link direto de uma imagem para a capa do Press Kit."
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      História & Release Oficial da Banda
                    </label>
                    <textarea
                      value={releaseBiografia}
                      onChange={(e) => setReleaseBiografia(e.target.value)}
                      rows={6}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Link do Instagram"
                      placeholder="https://instagram.com/..."
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />

                    <Input
                      label="Link do YouTube"
                      placeholder="https://youtube.com/..."
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <Input
                      label="Exigência do Sistema de P.A."
                      value={exigenciasPaSom}
                      onChange={(e) => setExigenciasPaSom(e.target.value)}
                      required
                    />

                    <Input
                      label="Mesa de Som Digital Recomendada"
                      value={mesaDigitalExigida}
                      onChange={(e) => setMesaDigitalExigida(e.target.value)}
                      required
                    />

                    <Input
                      label="Sistema de Monitoração In-Ear"
                      value={sistemaMonitoracao}
                      onChange={(e) => setSistemaMonitoracao(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Alimentação Elétrica"
                        value={energiaEletrica}
                        onChange={(e) => setEnergiaEletrica(e.target.value)}
                        required
                      />

                      <Input
                        label="Dimensões Mínimas do Palco"
                        value={dimensoesPalcoMinimo}
                        onChange={(e) => setDimensoesPalcoMinimo(e.target.value)}
                        required
                      />
                    </div>

                    <Input
                      label="Praticável e Microfonação de Bateria"
                      value={bateriaExigencia}
                      onChange={(e) => setBateriaExigencia(e.target.value)}
                      required
                    />

                    {/* Quick Input List Editor */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">
                          Canais de Entrada (Input List)
                        </label>
                        <button
                          type="button"
                          onClick={handleAddCanal}
                          className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Canal
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {canaisInput.map((canal, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                          >
                            <span className="font-mono font-bold text-teal-400 w-12 shrink-0">
                              Ch {canal.canal}
                            </span>
                            <input
                              type="text"
                              value={canal.descricao}
                              onChange={(e) => {
                                const copy = [...canaisInput]
                                copy[idx].descricao = e.target.value
                                setCanaisInput(copy)
                              }}
                              className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                              placeholder="Descrição"
                            />
                            <input
                              type="text"
                              value={canal.tipoMicOuDi}
                              onChange={(e) => {
                                const copy = [...canaisInput]
                                copy[idx].tipoMicOuDi = e.target.value
                                setCanaisInput(copy)
                              }}
                              className="w-40 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                              placeholder="Microfone / DI"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCanal(idx)}
                              className="p-1 text-slate-400 hover:text-red-400"
                              title="Remover canal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <Button variant="primary" size="md" type="submit">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
