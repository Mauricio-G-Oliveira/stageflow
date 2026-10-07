import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  UserCheck,
  ShieldCheck,
  Palette,
  Bell,
  Sun,
  Moon,
  KeyRound,
  CheckCircle2,
  X,
  CreditCard,
  MessageSquare,
  Send,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

const STORAGE_PIX_KEY = 'stageflow_admin_pix'
const STORAGE_ALERT_SETTINGS_KEY = 'stageflow_rehearsal_alert_settings'

export function ConfiguracoesPage() {
  const { user, changePassword } = useAuth()
  const { theme, setTheme, toggleTheme } = useTheme()

  const [notification, setNotification] = useState<string | null>(null)

  // Modal Alterar Senha
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Modal Alertas de Ensaio
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [alertHoursBefore, setAlertHoursBefore] = useState('24')
  const [alertMessageTemplate, setAlertMessageTemplate] = useState(
    'Fala {musico}! Lembrando do nosso ensaio dia {data} às {horario} no {local}. Por favor confirme presença!',
  )

  // Chave Pix do Dono
  const [pixKey, setPixKey] = useState(() => {
    return localStorage.getItem(STORAGE_PIX_KEY) || 'mauriciogoulart.deoliveira37@gmail.com'
  })
  const [pixTitular, setPixTitular] = useState(() => {
    return localStorage.getItem('stageflow_admin_pix_titular') || 'Mauricio G. Oliveira'
  })

  // Carrega configurações de alerta
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ALERT_SETTINGS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setAlertEnabled(parsed.enabled ?? true)
        setAlertHoursBefore(parsed.hoursBefore ?? '24')
        setAlertMessageTemplate(parsed.template ?? alertMessageTemplate)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const notify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3500)
  }

  const handleSavePix = (e: FormEvent) => {
    e.preventDefault()
    localStorage.setItem(STORAGE_PIX_KEY, pixKey.trim())
    localStorage.setItem('stageflow_admin_pix_titular', pixTitular.trim())
    notify('Chave PIX atualizada para cobrança das assinaturas!')
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas digitadas não coincidem.')
      return
    }

    if (!user) return

    const res = await changePassword(user.id, newPassword)
    if (res.success) {
      setIsPasswordModalOpen(false)
      setNewPassword('')
      setConfirmPassword('')
      notify('Senha alterada com sucesso!')
    } else {
      setPasswordError(res.error || 'Erro ao alterar senha.')
    }
  }

  const handleSaveAlertSettings = (e: FormEvent) => {
    e.preventDefault()
    const settings = {
      enabled: alertEnabled,
      hoursBefore: alertHoursBefore,
      template: alertMessageTemplate,
    }
    localStorage.setItem(STORAGE_ALERT_SETTINGS_KEY, JSON.stringify(settings))
    setIsAlertModalOpen(false)
    notify('Configurações de alerta de ensaio salvas!')
  }

  const handleTestWhatsAppAlert = () => {
    const text = encodeURIComponent(
      alertMessageTemplate
        .replace('{musico}', 'Equipe StageFlow')
        .replace('{data}', 'amanhã')
        .replace('{horario}', '19:30')
        .replace('{local}', 'Estúdio Principal'),
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Sistema</h1>
        <p className="text-sm text-slate-400 mt-1">
          Gerencie temas, alertas de ensaios, credenciais de acesso e sua chave Pix para cobranças SaaS.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Tema Claro / Escuro */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Aparência & Tema</h3>
            <p className="text-xs text-slate-400">
              Alterne entre o Modo Escuro (Dark - ideal para baixa luminosidade e palcos) e o Modo Claro (Light - para dia a dia).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-teal-500 text-teal-300 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-teal-400" />
                <span>Modo Escuro</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-slate-800 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Modo Claro</span>
              </button>
            </div>

            <Button variant="outline" size="sm" fullWidth onClick={toggleTheme}>
              Alternar Tema Agora (Ativo: {theme === 'dark' ? 'Escuro' : 'Claro'})
            </Button>
          </div>
        </div>

        {/* Card: Alertas de Ensaio & Convocação */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Alertas de Ensaio</h3>
            <p className="text-xs text-slate-400">
              Configure lembretes automáticos de ensaios com mensagem personalizada para envio via WhatsApp para os músicos.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setIsAlertModalOpen(true)}
              leftIcon={<MessageSquare className="w-4 h-4 text-rose-400" />}
            >
              Configurar Alertas de Ensaio
            </Button>
          </div>
        </div>

        {/* Card: Segurança & Senha */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Segurança da Conta</h3>
            <p className="text-xs text-slate-400">
              Conectado como <strong className="text-slate-200">{user?.email}</strong>. Perfil: <strong className="text-teal-400 uppercase">{user?.role}</strong>.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setIsPasswordModalOpen(true)}
              leftIcon={<KeyRound className="w-4 h-4 text-indigo-400" />}
            >
              Alterar Minha Senha
            </Button>
          </div>
        </div>

        {/* Card: Gestão de Usuários (Apenas Admin) */}
        {user?.role === 'admin' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Gestão SaaS & Usuários</h3>
              <p className="text-xs text-slate-400">
                Controle de assinaturas (30 dias / vencidas / teste de 3 dias), cobrança Pix e controle de acessos.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/usuarios">
                <Button variant="primary" size="sm" fullWidth>
                  Painel de Assinantes & Usuários
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Seção Chave PIX do Dono para Cobranças SaaS */}
      {user?.role === 'admin' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Chave PIX do Administrador (Recebimento SaaS)</h3>
              <p className="text-xs text-slate-400">
                Esta chave será incluída automaticamente nas mensagens de cobrança e renovação enviadas aos clientes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePix} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Input
              label="Chave PIX (E-mail, CPF ou Telefone) *"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Ex: mauriciogoulart.deoliveira37@gmail.com"
              required
            />
            <Input
              label="Nome do Titular *"
              value={pixTitular}
              onChange={(e) => setPixTitular(e.target.value)}
              placeholder="Ex: Mauricio G. Oliveira"
              required
            />
            <div className="flex items-end">
              <Button type="submit" variant="primary" size="md" fullWidth>
                Salvar Chave PIX
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Alterar Senha */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-400" />
                Alterar Senha de Acesso
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <Input
                label="Nova Senha (Mínimo 6 caracteres) *"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                required
              />

              <Input
                label="Confirme a Nova Senha *"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Atualizar Senha
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alertas de Ensaio */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-400" />
                Configurar Alertas de Ensaio & Convocação
              </h3>
              <button onClick={() => setIsAlertModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAlertSettings} className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Ativar Lembretes de Ensaio</span>
                  <span className="text-[11px] text-slate-400">Habilita disparos de convocação de ensaio</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertEnabled}
                  onChange={(e) => setAlertEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Antecedência do Alerta
                </label>
                <select
                  value={alertHoursBefore}
                  onChange={(e) => setAlertHoursBefore(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="48">48 horas antes (2 dias)</option>
                  <option value="24">24 horas antes (1 dia antes)</option>
                  <option value="4">4 horas antes do ensaio</option>
                  <option value="2">2 horas antes do ensaio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Mensagem Padrão de WhatsApp (Tags: &#123;musico&#125;, &#123;data&#125;, &#123;horario&#125;, &#123;local&#125;)
                </label>
                <textarea
                  rows={4}
                  value={alertMessageTemplate}
                  onChange={(e) => setAlertMessageTemplate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleTestWhatsAppAlert}
                  leftIcon={<Send className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Testar Envio no WhatsApp
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAlertModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Salvar Preferências
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
