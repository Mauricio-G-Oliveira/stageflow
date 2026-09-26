import { useState, useEffect, type FormEvent } from 'react'
import {
  Music2,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
  X,
  FileMusic,
} from 'lucide-react'
import type { Musica, NovaMusicaPayload } from '../../types/repertorio'
import { repertorioService } from '../../services/repertorioService'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function RepertorioPage() {
  const [musicas, setMusicas] = useState<Musica[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenero, setSelectedGenero] = useState<string>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Form State
  const [titulo, setTitulo] = useState('')
  const [artista, setArtista] = useState('')
  const [tom, setTom] = useState('C')
  const [genero, setGenero] = useState('Pop Rock')
  const [duracao, setDuracao] = useState('3:30')
  const [linkCifra, setLinkCifra] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const loadData = async () => {
    const list = await repertorioService.listarTodas()
    setMusicas(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !artista.trim()) {
      alert('Preencha o título da música e o nome do artista.')
      return
    }

    const payload: NovaMusicaPayload = {
      titulo: titulo.trim(),
      artista: artista.trim(),
      tom: tom.trim(),
      genero: genero.trim(),
      duracao: duracao.trim() || undefined,
      linkCifra: linkCifra.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      ativa: true,
    }

    await repertorioService.criar(payload)
    await loadData()
    setIsModalOpen(false)
    setNotification(`Música "${titulo}" adicionada ao repertório!`)
    setTimeout(() => setNotification(null), 3000)

    // Reset form
    setTitulo('')
    setArtista('')
    setTom('C')
    setGenero('Pop Rock')
    setDuracao('3:30')
    setLinkCifra('')
    setObservacoes('')
  }

  const handleDelete = async (id: string, tit: string) => {
    if (window.confirm(`Excluir "${tit}" do repertório?`)) {
      await repertorioService.excluir(id)
      await loadData()
      setNotification(`Música "${tit}" removida.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const generosDisponiveis = Array.from(new Set(musicas.map((m) => m.genero)))

  const filteredMusicas = musicas.filter((m) => {
    const matchesSearch =
      m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.artista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenero = selectedGenero === 'todos' || m.genero === selectedGenero

    return matchesSearch && matchesGenero
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Music2 className="w-6 h-6 text-[#0e6f5c]" />
            Repertório & Setlists
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize músicas da banda, tons musicais, cifras e arranjos para shows de casamentos e festas.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Nova Música
        </Button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por música, artista ou tom (ex: C, D, Em)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedGenero('todos')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedGenero === 'todos'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos ({musicas.length})
          </button>
          {generosDisponiveis.map((gen) => (
            <button
              key={gen}
              onClick={() => setSelectedGenero(gen)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedGenero === gen
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {gen}
            </button>
          ))}
        </div>
      </div>

      {/* Song Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Música / Artista</th>
                <th className="px-6 py-4 text-center">Tom</th>
                <th className="px-6 py-4">Gênero / Estilo</th>
                <th className="px-6 py-4">Duração</th>
                <th className="px-6 py-4">Observações</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMusicas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-xs">
                    Nenhuma música cadastrada ou encontrada com esses filtros.
                  </td>
                </tr>
              ) : (
                filteredMusicas.map((song) => (
                  <tr key={song.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                          <FileMusic className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-white block font-medium">{song.titulo}</strong>
                          <span className="text-xs text-slate-400">{song.artista}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs">
                        {song.tom}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {song.genero}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {song.duracao || '—'}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                      {song.observacoes || '—'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {song.linkCifra && (
                          <a
                            href={song.linkCifra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded"
                            title="Abrir Cifra / Letra"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(song.id, song.titulo)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Música */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Music2 className="w-4 h-4 text-teal-400" />
                Adicionar Música ao Repertório
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <Input
                label="Título da Música *"
                placeholder="Ex: Tempo Perdido"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <Input
                label="Artista / Banda Original *"
                placeholder="Ex: Legião Urbana"
                value={artista}
                onChange={(e) => setArtista(e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Tom *"
                  placeholder="Ex: C, Em, F#m"
                  value={tom}
                  onChange={(e) => setTom(e.target.value)}
                  required
                />
                <Input
                  label="Gênero"
                  placeholder="Ex: Pop Rock"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                />
                <Input
                  label="Duração"
                  placeholder="Ex: 4:15"
                  value={duracao}
                  onChange={(e) => setDuracao(e.target.value)}
                />
              </div>

              <Input
                label="Link da Cifra / Partitura"
                placeholder="https://www.cifraclub.com.br/..."
                value={linkCifra}
                onChange={(e) => setLinkCifra(e.target.value)}
              />

              <Input
                label="Observações / Arranjo"
                placeholder="Ex: Solo estendido no final, entrada após bateria"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Música
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
