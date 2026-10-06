import { useState, useEffect, type FormEvent, type ChangeEvent, useRef } from 'react'
import {
  Music2,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
  X,
  FileMusic,
  Upload,
  FileText,
  Eye,
  FileCheck,
} from 'lucide-react'
import type { Musica, NovaMusicaPayload, DocumentoAnexo } from '../../types/repertorio'
import { repertorioService } from '../../services/repertorioService'
import { parseDocxToText } from '../../utils/documentParser'
import { VisualizadorDocumento } from './VisualizadorDocumento'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function RepertorioPage() {
  const [musicas, setMusicas] = useState<Musica[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenero, setSelectedGenero] = useState<string>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Document Viewer State
  const [viewingDoc, setViewingDoc] = useState<{
    titulo: string
    artista?: string
    tipo: 'pdf' | 'docx' | 'txt'
    pdfUrl?: string
    textoConteudo?: string
  } | null>(null)

  // Direct File Reader Trigger
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [titulo, setTitulo] = useState('')
  const [artista, setArtista] = useState('')
  const [tom, setTom] = useState('C')
  const [genero, setGenero] = useState('Pop Rock')
  const [duracao, setDuracao] = useState('3:30')
  const [linkCifra, setLinkCifra] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [documentoAnexo, setDocumentoAnexo] = useState<DocumentoAnexo | null>(null)

  const loadData = async () => {
    const list = await repertorioService.listarTodas()
    setMusicas(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  // File processing (PDF, Word DOCX, TXT)
  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>, isDirectPreview = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const isPdf = extension === 'pdf'
    const isDocx = extension === 'docx' || extension === 'doc'
    const isTxt = extension === 'txt' || extension === 'cifra'

    if (!isPdf && !isDocx && !isTxt) {
      alert('Formato não suportado. Por favor, envie um arquivo PDF, Word (.docx) ou Texto (.txt).')
      return
    }

    let tipo: 'pdf' | 'docx' | 'txt' = isPdf ? 'pdf' : isDocx ? 'docx' : 'txt'
    let pdfUrl: string | undefined = undefined
    let textoConteudo: string | undefined = undefined

    if (isPdf) {
      pdfUrl = URL.createObjectURL(file)
    } else if (isDocx) {
      textoConteudo = await parseDocxToText(file)
    } else {
      textoConteudo = await file.text()
    }

    if (isDirectPreview) {
      // Abre direto no visualizador de palco
      setViewingDoc({
        titulo: file.name.replace(/\.[^/.]+$/, ''),
        artista: 'Importação Rápida',
        tipo,
        pdfUrl,
        textoConteudo,
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Salva no anexo da nova música sendo criada
    setDocumentoAnexo({
      nome: file.name,
      tipo,
      url: pdfUrl,
      conteudoTexto: textoConteudo,
      dataUpload: new Date().toISOString(),
    })
  }

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
      documento: documentoAnexo || undefined,
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
    setDocumentoAnexo(null)
  }

  const handleDelete = async (id: string, tit: string) => {
    if (window.confirm(`Excluir "${tit}" do repertório?`)) {
      await repertorioService.excluir(id)
      await loadData()
      setNotification(`Música "${tit}" removida.`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleOpenSongDoc = (musica: Musica) => {
    if (musica.documento) {
      setViewingDoc({
        titulo: musica.titulo,
        artista: musica.artista,
        tipo: musica.documento.tipo,
        pdfUrl: musica.documento.url,
        textoConteudo: musica.documento.conteudoTexto,
      })
    } else {
      // Se não tiver anexo salvo mas tem link de cifra, abre o leitor com template
      setViewingDoc({
        titulo: musica.titulo,
        artista: musica.artista,
        tipo: 'txt',
        textoConteudo: `[${musica.titulo} - ${musica.artista}]\nTom Original: ${musica.tom}\nGênero: ${musica.genero}\n\nObservações Técnicas:\n${musica.observacoes || 'Sem observações.'}\n\n(Dica: você pode anexar um arquivo PDF ou Word nesta música clicando em Editar)`,
      })
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
      {/* Hidden file input for fast doc preview */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelected(e, true)}
        accept=".pdf,.docx,.doc,.txt"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Music2 className="w-6 h-6 text-[#0e6f5c]" />
            Repertório, Partituras & Cifras
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize músicas da banda com leitor integrado de PDF e Word (.docx) com rolagem para palco.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4 text-teal-400" />}
          >
            Leitor Rápido (PDF/Word)
          </Button>

          <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nova Música
          </Button>
        </div>
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
                <th className="px-6 py-4">Partitura / Cifra</th>
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

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenSongDoc(song)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          song.documento
                            ? 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {song.documento ? (
                          <>
                            <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                            <span>{song.documento.tipo.toUpperCase()} Anexo</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Modo Palco</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {song.linkCifra && (
                          <a
                            href={song.linkCifra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded"
                            title="Abrir Link Externo CifraClub"
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

      {/* Modal Nova Música com Anexo PDF/Word */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
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

              {/* Upload de PDF ou Word (.docx) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Importar Arquivo de Partitura / Cifra (PDF ou Word)
                </label>
                <div className="border border-dashed border-slate-700 rounded-xl p-3 bg-slate-950/60 hover:border-teal-500/50 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate text-left">
                      <p className="text-xs text-white truncate font-medium">
                        {documentoAnexo ? documentoAnexo.nome : 'Selecione um arquivo .pdf ou .docx'}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {documentoAnexo ? `Tipo: ${documentoAnexo.tipo.toUpperCase()}` : 'Aparece direto no leitor de palco'}
                      </span>
                    </div>
                  </div>

                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold cursor-pointer shrink-0 transition-colors">
                    <span>{documentoAnexo ? 'Alterar' : 'Procurar'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={(e) => handleFileSelected(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Input
                label="Link da Cifra / Partitura Online"
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

      {/* Visualizador de Documento / Modo Palco */}
      {viewingDoc && (
        <VisualizadorDocumento
          titulo={viewingDoc.titulo}
          artista={viewingDoc.artista}
          arquivoTipo={viewingDoc.tipo}
          pdfUrl={viewingDoc.pdfUrl}
          textoConteudo={viewingDoc.textoConteudo}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  )
}
