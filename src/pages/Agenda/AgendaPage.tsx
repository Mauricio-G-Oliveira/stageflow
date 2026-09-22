import { CalendarDays, Plus } from 'lucide-react'
import { Button } from '../../components/Button/Button'

export function AgendaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agenda de Compromissos</h1>
          <p className="text-sm text-slate-400 mt-1">
            Visualização de ensaios, passagens de som e apresentações agendadas.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Novo Agendamento
        </Button>
      </div>

      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <CalendarDays className="w-12 h-12 text-teal-400 mx-auto mb-3 opacity-80" />
        <h3 className="text-lg font-semibold text-white">Módulo de Agenda em Construção</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
          Em breve você terá calendário interativo mensal e semanal para acompanhamento de datas.
        </p>
      </div>
    </div>
  )
}
