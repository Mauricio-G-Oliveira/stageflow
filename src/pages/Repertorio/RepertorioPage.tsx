import { Music2, Plus } from 'lucide-react'
import { Button } from '../../components/Button/Button'

export function RepertorioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Repertório Musical & Setlists</h1>
          <p className="text-sm text-slate-400 mt-1">
            Organização de músicas, tons, cifras, links de áudio e montagem de setlists.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Nova Música
        </Button>
      </div>

      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <Music2 className="w-12 h-12 text-teal-400 mx-auto mb-3 opacity-80" />
        <h3 className="text-lg font-semibold text-white">Módulo de Repertório em Construção</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
          Crie repertórios por estilo musical, configure tom e baixe setlists em PDF para o palco.
        </p>
      </div>
    </div>
  )
}
