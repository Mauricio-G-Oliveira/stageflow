import { useState, useEffect, type FormEvent } from 'react'
import {
  Mic2,
  Plus,
  Trash2,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  X,
  CreditCard,
  Music,
} from 'lucide-react'
import type { Musico, NovoMusicoPayload, TipoVinculoMusico } from '../../types/musico'
import { musicoService } from '../../services/musicoService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function MusicosPage() {
  const [musicos, setMusicos] = useState<Musico[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Form State
  const [nome, setNome] = useState('')
  const [instrumentoPrincipal, setInstrumentoPrincipal] = useState('Voz Principal')
  const [tipoVinculo, setTipoVinculo] = useState<TipoVinculoMusico>('fixo')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [chavePix, setChavePix] = useState('')
  const [cachePadrao, setCachePadrao] = useState(1000)
  const [observacoes, setObservacoes] = useState('')

  const loadData = async () => {
    const list = await musicoService.listarTodos()
    setMusicos(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenNewModal = () => {
    setEditingId(null)
    setNome('')
    setInstrumentoPrincipal('Voz Principal')
    setTipoVinculo('fixo')
    setTelefone('')
    setEmail('')
    setChavePix('')
    setCachePadrao(1000)
    setObservacoes('')
    setIsModalOpen(true)
  }

  const handleEdit = (m: Musico) => {
    setEditingId(m.id)
    setNome(m.nome)
    setInstrumentoPrincipal(m.instrumentoPrincipal)
    setTipoVinculo(m.tipoVinculo)
    setTelefone(m.telefone)
    setEmail(m.email || '')
    setChavePix(m.chavePix || '')
    setCachePadrao(m.cachePadrao || 1000)
    setObservacoes(m.observacoes || '')
    setIsModalOpen(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!nome.trim() || !instrumentoPrincipal.trim()) {
      alert('Preencha o nome e o instrumento principal do integrante.')
      return
    }

    const payload: NovoMusicoPayload = {
      nome: nome.trim(),
      instrumentoPrincipal: instrumentoPrincipal.trim(),
      tipoVinculo,
      telefone: telefone.trim(),
      email: email.trim() || undefined,
      chavePix: chavePix.trim() || undefined,
      cachePadrao,
      status: 'ativo',
      observacoes: observacoes.trim() || undefined,
    }

    if (editingId) {
      await musicoService.atualizar(editingId, payload)
      setNotification('Dados do integrante atualizados!')
    } else {
      await musicoService.criar(payload)
      setNotification('Novo integrante cadastrado na banda!')
    }

    await loadData()
    setIsModalOpen(false)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Remover "${name}" da lista de músicos?`)) {
      await musicoService.excluir(id)
      await loadData()
      setNotification(`Integrante "${name}" removido.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const instrumentosComuns = [
    'Voz Principal',
    'Guitarra Solo',
    'Guitarra Base / Violão',
    'Baixo',
    'Teclado / Piano',
    'Bateria',
    'Saxofone / Metais',
    'Trompete',
    'Trombone',
    'Percussão',
    'Backing Vocal',
    'Técnico de Som / Roadie',
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Mic2 className="w-6 h-6 text-[#0e6f5c]" />
            Músicos & Integrantes da Banda
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cadastre os 5+ músicos da sua formação fixa e freelancers substitutos com instrumentos, contatos e Pix.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenNewModal} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Músico
        </Button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid of Musicians */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {musicos.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0e6f5c] text-white flex items-center justify-center font-bold text-sm">
                    {m.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{m.nome}</h3>
                    <span className="text-xs text-teal-400 font-medium">{m.instrumentoPrincipal}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    m.tipoVinculo === 'fixo'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                >
                  {m.tipoVinculo}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                {m.telefone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {m.telefone}
                  </p>
                )}
                {m.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {m.email}
                  </p>
                )}
                {m.chavePix && (
                  <p className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    PIX: {m.chavePix}
                  </p>
                )}
                {m.observacoes && (
                  <p className="text-[11px] text-slate-400 italic pt-1">{m.observacoes}</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">
                Cachê Padrão: R$ {m.cachePadrao || 1000}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(m)}
                  className="p-1.5 text-slate-400 hover:text-white rounded"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {m.nome !== 'Mauricio G. Oliveira' && (
                  <button
                    onClick={() => handleDelete(m.id, m.nome)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Novo / Editar Músico */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-teal-400" />
                {editingId ? 'Editar Integrante' : 'Cadastrar Integrante da Banda'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <Input
                label="Nome do Músico *"
                placeholder="Ex: Gabriel Souza"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Instrumento Principal *
                </label>
                <select
                  value={instrumentoPrincipal}
                  onChange={(e) => setInstrumentoPrincipal(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  {instrumentosComuns.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Vínculo</label>
                  <select
                    value={tipoVinculo}
                    onChange={(e) => setTipoVinculo(e.target.value as TipoVinculoMusico)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="fixo">Músico Fixo</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="substituto">Substituto</option>
                    <option value="tecnico">Técnico / Roadie</option>
                  </select>
                </div>

                <Input
                  label="Cachê Padrão (R$)"
                  type="number"
                  step="50"
                  value={cachePadrao}
                  onChange={(e) => setCachePadrao(Number(e.target.value))}
                />
              </div>

              <Input
                label="Telefone / WhatsApp"
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />

              <Input
                label="Chave PIX para Pagamento"
                placeholder="CPF, e-mail ou telefone"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
              />

              <Input
                label="Observações / Detalhes"
                placeholder="Ex: Leva amplificador próprio, fone in-ear P10"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Integrante
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
