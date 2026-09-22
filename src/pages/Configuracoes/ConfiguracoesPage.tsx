import { Link } from 'react-router-dom'
import { UserCheck, ShieldCheck, Palette, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button/Button'

export function ConfiguracoesPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Sistema</h1>
        <p className="text-sm text-slate-400 mt-1">
          Gerencie preferências de conta, notificações e acessos da equipe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.role === 'admin' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Usuários & Permissões</h3>
              <p className="text-xs text-slate-400">
                Cadastre novos músicos, redefina senhas provisórias e gerencie o nível de acesso de cada membro da equipe.
              </p>
            </div>
            <div className="pt-4">
              <Link to="/usuarios">
                <Button variant="primary" size="sm" fullWidth>
                  Acessar Gestão de Usuários
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Segurança da Conta</h3>
            <p className="text-xs text-slate-400">
              Conectado como <strong className="text-slate-200">{user?.email}</strong>. Altere sua senha e configure autenticação de dois fatores.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" size="sm" fullWidth disabled>
              Alterar Senha (Em Breve)
            </Button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Aparência & Identidade</h3>
            <p className="text-xs text-slate-400">
              Personalização de tema escuro/claro e paleta de cores StageFlow.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" size="sm" fullWidth disabled>
              Tema Escuro Ativo
            </Button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Notificações & Lembretes</h3>
            <p className="text-xs text-slate-400">
              Receba alertas de ensaios e confirmação de presença dos músicos via WhatsApp/E-mail.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" size="sm" fullWidth disabled>
              Configurar Alertas
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
