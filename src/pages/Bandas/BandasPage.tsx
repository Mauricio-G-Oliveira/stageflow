import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users2,
  Mic2,
  Plus,
  Volume2,
  ShieldCheck,
} from 'lucide-react'
import type { Musico } from '../../types/musico'
import type { Evento } from '../../types/evento'
import { musicoService } from '../../services/musicoService'
import { eventoService } from '../../services/eventoService'
import { Button } from '../../components/Button/Button'

export function BandasPage() {
  const [musicos, setMusicos] = useState<Musico[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    const load = async () => {
      const mus = await musicoService.listarTodos()
      const evts = await eventoService.listarTodos()
      setMusicos(mus)
      setEventos(evts)
    }
    load()
  }, [])

  const riderEquipamentos = [
    { item: 'Sistema de PA Ativo (2 Caixas + 1 Subwoofer)', responsavel: 'Banda / Som Central' },
    { item: 'Mesa de Som Digital (mínimo 16 canais)', responsavel: 'Banda' },
    { item: 'Sistema de Retorno por Fones In-Ear (5 fones)', responsavel: 'Cada Músico' },
    { item: 'Microfones Sem Fio para Vocalistas', responsavel: 'Vocal / Direção' },
    { item: 'Direct Boxes e Cabeamento XLR/P10', responsavel: 'Banda' },
    { item: 'Ponto de Energia Elétrica Estabilizada 110v/220v no Palco', responsavel: 'Contratante / Local' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-[#0e6f5c]" />
            Formação da Banda & Rider Técnico
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configuração da formação padrão (5 músicos ou mais), funções de palco e checklist de equipamentos.
          </p>
        </div>

        <Link to="/musicos">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Gerenciar Músicos
          </Button>
        </Link>
      </div>

      {/* Main Band Info Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0e6f5c]/20 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
              Formação Principal
            </span>
            <h2 className="text-xl font-bold text-white">StageFlow Band • Formação 5+</h2>
            <p className="text-xs text-slate-400">
              Direção Musical: <strong>Mauricio G. Oliveira</strong> • Casamentos, Formaturas, Aniversários e Festas Corporativas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Integrantes Cadastrados</span>
              <strong className="text-lg text-teal-300 block">{musicos.length} músicos</strong>
            </div>
            <div className="text-right pl-4 border-l border-slate-800">
              <span className="text-xs text-slate-400 block">Shows Agendados</span>
              <strong className="text-lg text-emerald-400 block">{eventos.length} shows</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formação de 5 Músicos ou Mais */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-teal-400" />
                Integrantes da Formação Padrão
              </h3>
              <p className="text-xs text-slate-400">Músicos titulares e instrumentos de palco</p>
            </div>
            <Link to="/musicos" className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
              Ver todos
            </Link>
          </div>

          <div className="space-y-2.5">
            {musicos.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0e6f5c] text-white flex items-center justify-center font-bold text-xs">
                    {m.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.nome}</h4>
                    <span className="text-[11px] text-teal-400">{m.instrumentoPrincipal}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    R$ {m.cachePadrao || 1000}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Cachê padrão</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rider Técnico & Equipamentos */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-400" />
                Rider Técnico Básico (Equipamentos)
              </h3>
              <p className="text-xs text-slate-400">Checklist essencial para passagem de som e show</p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">6 itens essenciais</span>
          </div>

          <div className="space-y-2.5">
            {riderEquipamentos.map((eq, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-200 block">{eq.item}</span>
                  <span className="text-[10px] text-slate-500">Responsável: {eq.responsavel}</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
