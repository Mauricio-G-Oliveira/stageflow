import { useState, useEffect, type FormEvent } from 'react'
import {
  Mic2,
  Plus,
  Trash2,
  Phone,
  Edit2,
  CheckCircle2,
  X,
  CreditCard,
  Music,
  Wrench,
  Users2,
  DollarSign,
} from 'lucide-react'
import type { Musico, NovoMusicoPayload, TipoVinculoMusico, CategoriaEquipe } from '../../types/musico'
import { musicoService } from '../../services/musicoService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

const INSTRUMENTOS_SUGESTO = [
  'Voz Principal & Violão',
  'Guitarra Solo & Base',
  'Baixo & Direção Musical',
  'Bateria & Percussão',
  'Teclado & Sintetizador',
  'Saxofone / Metais',
  'Violão de Aço / Nylon',
  'Percussão Geral',
]

const FUNCOES_TECNICAS_SUGESTO = [
  'Roadie / Apoio de Palco',
  'Segundo Roadie (Montagem / Cabos)',
  'Técnico de Som (P.A. & Mix)',
  'Técnico de Monitor / In-Ear',
  'Técnico de Iluminação & Cênica',
  'Produtor / Road Manager',
  'Apoio de Transporte / Carregador',
]

export function MusicosPage() {
  const [equipe, setEquipe] = useState<Musico[]>([])
  const [activeTab, setActiveTab] = useState<'todos' | 'musico' | 'tecnico'>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Form State
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState<CategoriaEquipe>('musico')
  const [instrumentoPrincipal, setInstrumentoPrincipal] = useState('Voz Principal & Violão')
  const [tipoVinculo, setTipoVinculo] = useState<TipoVinculoMusico>('fixo')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [chavePix, setChavePix] = useState('')
  const [cachePadrao, setCachePadrao] = useState(1000)
  const [observacoes, setObservacoes] = useState('')

  const loadData = async () => {
    const list = await musicoService.listarTodos()
    setEquipe(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const musicosCount = equipe.filter((e) => e.categoria === 'musico').length
  const tecnicosCount = equipe.filter((e) => e.categoria === 'tecnico').length
  const folhaTotal = equipe.reduce((acc, curr) => acc + (curr.cachePadrao || 0), 0)

  const filteredEquipe = equipe.filter((item) => {
    if (activeTab === 'todos') return true
    return item.categoria === activeTab
  })

  const handleOpenNewModal = (cat: CategoriaEquipe = 'musico') => {
    setEditingId(null)
    setNome('')
    setCategoria(cat)
    setInstrumentoPrincipal(
      cat === 'musico' ? 'Voz Principal & Violão' : 'Roadie / Apoio de Palco'
    )
    setTipoVinculo(cat === 'musico' ? 'fixo' : 'apoio')
    setTelefone('')
    setEmail('')
    setChavePix('')
    setCachePadrao(cat === 'musico' ? 1000 : 350)
    setObservacoes('')
    setIsModalOpen(true)
  }

  const handleEdit = (m: Musico) => {
    setEditingId(m.id)
    setNome(m.nome)
    setCategoria(m.categoria || (m.instrumentoPrincipal.toLowerCase().includes('roadie') || m.instrumentoPrincipal.toLowerCase().includes('técnico') ? 'tecnico' : 'musico'))
    setInstrumentoPrincipal(m.instrumentoPrincipal)
    setTipoVinculo(m.tipoVinculo)
    setTelefone(m.telefone)
    setEmail(m.email || '')
    setChavePix(m.chavePix || '')
    setCachePadrao(m.cachePadrao || (m.categoria === 'tecnico' ? 350 : 1000))
    setObservacoes(m.observacoes || '')
    setIsModalOpen(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!nome.trim() || !instrumentoPrincipal.trim()) {
      alert('Preencha o nome e a função/instrumento.')
      return
    }

    const payload: NovoMusicoPayload = {
      nome: nome.trim(),
      categoria,
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
      setNotification('Dados atualizados com sucesso!')
    } else {
      await musicoService.criar(payload)
      setNotification(
        categoria === 'musico'
          ? 'Novo músico adicionado à formação!'
          : 'Novo profissional técnico adicionado à equipe!'
      )
    }

    await loadData()
    setIsModalOpen(false)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDelete = async (id: string, itemNome: string) => {
    if (confirm(`Remover "${itemNome}" da equipe da banda?`)) {
      await musicoService.excluir(id)
      await loadData()
      setNotification(`"${itemNome}" foi removido da equipe.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users2 className="w-6 h-6 text-teal-400" />
              Músicos & Equipe da Banda
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
              Formação Flexível
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Gerencie os músicos no palco (ex: 4 integrantes) e a equipe técnica (roadies, técnicos de som e luz).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Wrench className="w-4 h-4 text-amber-400" />}
            onClick={() => handleOpenNewModal('tecnico')}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
          >
            + Roadie / Técnico
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenNewModal('musico')}
          >
            + Músico no Palco
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total de Integrantes</span>
            <Users2 className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{equipe.length} pessoas</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Equipe completa da banda</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Músicos no Palco</span>
            <Mic2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{musicosCount} músicos</p>
          <p className="text-[11px] text-indigo-300 mt-0.5">Formação atual de palco</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Equipe Técnica / Staff</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{tecnicosCount} profissional(is)</p>
          <p className="text-[11px] text-amber-300 mt-0.5">Roadie, som & montagem</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Folha de Cachê Estimada</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {folhaTotal.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Custo total por apresentação</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('todos')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'todos'
              ? 'bg-[#0e6f5c] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Todos ({equipe.length})
        </button>
        <button
          onClick={() => setActiveTab('musico')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'musico'
              ? 'bg-[#0e6f5c] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Músicos de Palco ({musicosCount})
        </button>
        <button
          onClick={() => setActiveTab('tecnico')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'tecnico'
              ? 'bg-[#0e6f5c] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Equipe Técnica & Roadies ({tecnicosCount})
        </button>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipe.map((member) => {
          const isMusico = member.categoria === 'musico'
          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all hover:border-teal-500/40 shadow-lg relative flex flex-col justify-between ${
                isMusico ? 'border-slate-800' : 'border-amber-500/20 bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
                        isMusico
                          ? 'bg-gradient-to-tr from-[#0e6f5c] to-teal-500 text-white'
                          : 'bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black'
                      }`}
                    >
                      {isMusico ? <Music className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{member.nome}</h3>
                      <p className="text-xs text-teal-400 font-medium mt-0.5">
                        {member.instrumentoPrincipal}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isMusico
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}
                  >
                    {isMusico ? 'Músico' : 'Técnico / Staff'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> Contato:
                    </span>
                    <span className="font-mono text-white">{member.telefone || 'Não informado'}</span>
                  </div>

                  {member.chavePix && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500" /> PIX:
                      </span>
                      <span className="font-mono text-slate-200 truncate max-w-[170px]" title={member.chavePix}>
                        {member.chavePix}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Cachê padrão:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      R$ {(member.cachePadrao || 0).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {member.observacoes && (
                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                      "{member.observacoes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Editar dados"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.nome)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remover integrante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingId ? 'Editar Integrante / Equipe' : 'Adicionar à Equipe da Banda'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Defina o papel deste membro na banda (músico de palco ou equipe técnica como roadie/técnico de som).
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Seleção de Categoria */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tipo de Atuação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoria('musico')
                      if (instrumentoPrincipal.toLowerCase().includes('roadie')) {
                        setInstrumentoPrincipal('Voz Principal & Violão')
                        setCachePadrao(1000)
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      categoria === 'musico'
                        ? 'bg-[#0e6f5c] text-white border-teal-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Music className="w-4 h-4" /> Músico no Palco
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoria('tecnico')
                      setInstrumentoPrincipal('Roadie / Apoio de Palco')
                      setCachePadrao(350)
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      categoria === 'tecnico'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-4 h-4" /> Equipe Técnica / Roadie
                  </button>
                </div>
              </div>

              <Input
                label="Nome do Profissional"
                placeholder="Ex: João Silva ou Roadie Lucas"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Função / Instrumento Principal
                </label>
                <input
                  type="text"
                  value={instrumentoPrincipal}
                  onChange={(e) => setInstrumentoPrincipal(e.target.value)}
                  placeholder="Ex: Baixo, Bateria, Roadie, Técnico de Som"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(categoria === 'musico' ? INSTRUMENTOS_SUGESTO : FUNCOES_TECNICAS_SUGESTO).map(
                    (sugestao) => (
                      <button
                        key={sugestao}
                        type="button"
                        onClick={() => setInstrumentoPrincipal(sugestao)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        {sugestao}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Telefone / WhatsApp"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />

                <Input
                  label="Chave PIX (para cachê)"
                  placeholder="CPF, celular ou e-mail"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Cachê Padrão por Show (R$)"
                  type="number"
                  value={cachePadrao}
                  onChange={(e) => setCachePadrao(Number(e.target.value))}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Vínculo com a Banda
                  </label>
                  <select
                    value={tipoVinculo}
                    onChange={(e) => setTipoVinculo(e.target.value as TipoVinculoMusico)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                  >
                    <option value="fixo">Integrante Fixo</option>
                    <option value="freelancer">Freelancer / Convidado</option>
                    <option value="substituto">Substituto Eventual</option>
                    <option value="apoio">Equipe Técnica / Apoio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Observações / Funções Extras
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Responsável pela van, afinação de instrumentos, microfonação..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#0e6f5c] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <Button variant="primary" size="md" type="submit">
                  {editingId ? 'Salvar Alterações' : 'Cadastrar na Equipe'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
