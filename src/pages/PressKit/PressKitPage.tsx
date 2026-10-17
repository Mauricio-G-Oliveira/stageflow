import { useState, useEffect, type FormEvent } from 'react'
import {
  Sparkles,
  Printer,
  Edit2,
  CheckCircle2,
  Users,
  Music2,
  Sliders,
  X,
  MapPin,
  Check,
  Copy,
  Radio,
} from 'lucide-react'
import { pressKitService, type PressKitData } from '../../services/pressKitService'
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

export function PressKitPage() {
  const [data, setData] = useState<PressKitData>(pressKitService.getData())
  const [isEditing, setIsEditing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Edit State
  const [nomeBanda, setNomeBanda] = useState(data.nomeBanda)
  const [slogan, setSlogan] = useState(data.slogan)
  const [cidadeOrigem, setCidadeOrigem] = useState(data.cidadeOrigem)
  const [releaseBiografia, setReleaseBiografia] = useState(data.releaseBiografia)
  const [whatsappContato, setWhatsappContato] = useState(data.linksOficiais.whatsappContato)
  const [instagram, setInstagram] = useState(data.linksOficiais.instagram)
  const [youtube, setYoutube] = useState(data.linksOficiais.youtube)

  useEffect(() => {
    setData(pressKitService.getData())
  }, [])

  const handleCopyWhatsApp = () => {
    const texto = pressKitService.gerarTextoWhatsApp(data)
    navigator.clipboard.writeText(texto)
    setCopied(true)
    setNotification('Texto do Press Kit copiado! Cole no WhatsApp do contratante.')
    setTimeout(() => {
      setCopied(false)
      setNotification(null)
    }, 4000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault()

    const updated = pressKitService.saveData({
      nomeBanda: nomeBanda.trim(),
      slogan: slogan.trim(),
      cidadeOrigem: cidadeOrigem.trim(),
      releaseBiografia: releaseBiografia.trim(),
      linksOficiais: {
        ...data.linksOficiais,
        whatsappContato: whatsappContato.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
    })

    // Also sync band name in central config
    bandaConfigService.saveConfig({
      nomeBanda: nomeBanda.trim(),
      cidadeEstado: cidadeOrigem.trim(),
      responsavelTelefone: whatsappContato.trim(),
    })

    setData(updated)
    setIsEditing(false)
    setNotification('Dados do Press Kit atualizados!')
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-400" />
              Press Kit Oficial da Banda
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
              Material de Divulgação
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Espaço para bio, fotos, rider técnico, mapa de palco e envio rápido para contratantes.
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
            {copied ? 'Copiado!' : 'Copiar p/ WhatsApp'}
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
            onClick={() => {
              setNomeBanda(data.nomeBanda)
              setSlogan(data.slogan)
              setCidadeOrigem(data.cidadeOrigem)
              setReleaseBiografia(data.releaseBiografia)
              setWhatsappContato(data.linksOficiais.whatsappContato)
              setInstagram(data.linksOficiais.instagram)
              setYoutube(data.linksOficiais.youtube)
              setIsEditing(true)
            }}
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Editar Press Kit
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Press Kit Paper / Visual Presentation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Hero Section */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0e6f5c] via-[#0b483c] to-slate-950 p-6 sm:p-10 overflow-hidden text-white border border-teal-500/30 shadow-lg print:border-slate-300 print:bg-teal-900">
          <div className="relative z-10 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-teal-200 border border-white/20 inline-block">
              Apresentação Artística & Musical
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {data.nomeBanda}
            </h2>

            <p className="text-sm sm:text-base text-teal-100 max-w-2xl leading-relaxed font-medium">
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

        {/* Biografia / Release Oficial */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
            <Radio className="w-4 h-4" /> Release Oficial da Banda
          </h3>
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line print:bg-slate-50 print:text-slate-800 print:border-slate-200">
            {data.releaseBiografia}
          </div>
        </div>

        {/* Formação de Palco & Integrantes */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
            <Users className="w-4 h-4" /> Formação de Palco ({data.formacaoPalco.musicos} Músicos + {data.formacaoPalco.equipeTecnica} Roadie)
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

        {/* Rider Técnico & Palco Silencioso */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 print:text-slate-900">
            <Sliders className="w-4 h-4" /> Rider Técnico & Mapa de Áudio (Input List)
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto print:bg-slate-50 print:border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 print:border-slate-300 print:text-slate-700">
                  <th className="py-2 px-3 font-semibold">Canal</th>
                  <th className="py-2 px-3 font-semibold">Instrumento / Sinal</th>
                  <th className="py-2 px-3 font-semibold">Microfone / D.I. Recomendado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {data.riderTecnico.canaisInput.map((ch) => (
                  <tr key={ch.canal} className="text-slate-200 print:text-slate-900">
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-400 print:text-teal-800">
                      Ch {ch.canal}
                    </td>
                    <td className="py-2.5 px-3 font-medium">{ch.descricao}</td>
                    <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">
                      {ch.tipoMicOuDi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1 print:bg-slate-50 print:border-slate-200">
              <strong className="text-white block print:text-slate-900">Monitoração de Palco:</strong>
              <p className="text-slate-300 print:text-slate-700">
                {data.riderTecnico.sistemaMonitoracao}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1 print:bg-slate-50 print:border-slate-200">
              <strong className="text-white block print:text-slate-900">Alimentação Elétrica:</strong>
              <p className="text-slate-300 print:text-slate-700">
                {data.riderTecnico.energiaEletrica}
              </p>
            </div>
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
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-200 print:bg-slate-50 print:border-slate-200 print:text-slate-900"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{rep}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links e Contatos */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-slate-100 print:border-slate-300">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white print:text-slate-900">
              Contratação de Shows & Informações
            </h4>
            <p className="text-xs text-slate-400 print:text-slate-700">
              WhatsApp Direto: <strong className="text-emerald-400 print:text-emerald-700">{data.linksOficiais.whatsappContato}</strong>
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
      </div>

      {/* Modal de Edição do Press Kit */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Editar Press Kit da Banda</h3>
            <p className="text-xs text-slate-400 mb-5">
              Atualize o nome da banda, bio, contatos e redes sociais para envio aos contratantes.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Biografia & Release Oficial da Banda
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <Button variant="primary" size="md" type="submit">
                  Salvar Press Kit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
