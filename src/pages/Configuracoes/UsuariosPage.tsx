import { useState, type FormEvent } from 'react'
import {
  UserPlus,
  Trash2,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Clock,
  MessageCircle,
  RefreshCw,
  Copy,
  Send,
  AlertTriangle,
  Lock,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole, NewUserPayload, PlanType } from '../../types/auth'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

const STORAGE_PIX_KEY = 'stageflow_admin_pix'
const STORAGE_PIX_TITULAR = 'stageflow_admin_pix_titular'

export function UsuariosPage() {
  const { users, user: currentUser, addUser, removeUser, extendAccess } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'vencido' | 'teste'>('all')

  // Modal Cobrança Pix
  const [billingUser, setBillingUser] = useState<(typeof users)[0] | null>(null)
  const [copied, setCopied] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('musico')
  const [instrument, setInstrument] = useState('')
  const [phone, setPhone] = useState('')
  const [planType, setPlanType] = useState<PlanType>('mensal_30_dias')
  const [monthlyFee, setMonthlyFee] = useState<number>(49.9)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const adminPixKey = localStorage.getItem(STORAGE_PIX_KEY) || 'mauriciogoulart.deoliveira37@gmail.com'
  const adminPixTitular = localStorage.getItem(STORAGE_PIX_TITULAR) || 'Mauricio G. Oliveira'

  const notify = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3500)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const calculateDaysRemaining = (expiresAtStr: string) => {
    const exp = new Date(expiresAtStr).getTime()
    const now = new Date().getTime()
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (isoStr: string) => {
    if (!isoStr) return '—'
    const d = new Date(isoStr)
    return d.toLocaleDateString('pt-BR')
  }

  const handleOpenModal = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('musico')
    setInstrument('')
    setPhone('')
    setPlanType('mensal_30_dias')
    setMonthlyFee(49.9)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setFormError(null)
    setIsSubmitting(true)

    try {
      const payload: NewUserPayload = {
        name,
        email,
        password,
        role,
        instrument: instrument || undefined,
        phone: phone || undefined,
        planType,
        monthlyFee: planType === 'teste_3_dias' ? 0 : Number(monthlyFee),
        customDays: planType === 'teste_3_dias' ? 3 : 30,
      }

      const result = await addUser(payload)
      if (result.success) {
        setIsModalOpen(false)
        notify(
          planType === 'teste_3_dias'
            ? `Usuário "${name}" cadastrado com Acesso de Teste (3 dias)!`
            : `Assinante "${name}" cadastrado com 30 dias de acesso!`,
        )
      } else {
        setFormError(result.error || 'Erro ao cadastrar usuário.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExtendSubscription = async (userId: string, userName: string) => {
    if (window.confirm(`Confirmar renovação de +30 dias para "${userName}" mediante pagamento?`)) {
      const res = await extendAccess(userId, 30)
      if (res.success) {
        notify(`Acesso de "${userName}" renovado por mais 30 dias com sucesso!`)
      }
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o acesso de "${userName}"?`)) {
      const result = await removeUser(userId)
      if (!result.success) {
        alert(result.error)
      } else {
        notify(`Acesso de "${userName}" removido.`)
      }
    }
  }

  const getBillingMessage = (u: (typeof users)[0]) => {
    const vencimentoStr = formatDate(u.expiresAt)
    const valorStr = formatCurrency(u.monthlyFee || 49.9)
    return `Olá ${u.name}! Tudo bem?\n\nPassando para lembrar que sua assinatura do StageFlow vence em *${vencimentoStr}*.\n\nPara continuar utilizando o sistema normalmente por mais 30 dias, segue nossa chave PIX:\n\n*Chave PIX:* ${adminPixKey}\n*Titular:* ${adminPixTitular}\n*Valor:* ${valorStr}\n\nApós o pagamento, basta enviar o comprovante aqui para renovarmos seu acesso imediatamente!`
  }

  const handleCopyMessage = (u: (typeof users)[0]) => {
    const text = getBillingMessage(u)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendWhatsApp = (u: (typeof users)[0]) => {
    const rawPhone = (u.phone || '').replace(/\D/g, '')
    const phoneParam = rawPhone.length >= 10 ? `55${rawPhone}` : ''
    const text = encodeURIComponent(getBillingMessage(u))
    const url = phoneParam
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`
    window.open(url, '_blank')
  }

  // Métricas SaaS
  const totalUsuarios = users.length
  const assinantesAtivos = users.filter((u) => u.subscriptionStatus === 'ativo').length
  const contasVencidas = users.filter((u) => u.subscriptionStatus === 'vencido').length
  const emTeste3Dias = users.filter((u) => u.subscriptionStatus === 'teste').length
  const mrrTotal = users
    .filter((u) => u.subscriptionStatus === 'ativo')
    .reduce((acc, curr) => acc + (curr.monthlyFee || 0), 0)

  // Filtros
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.instrument && u.instrument.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || u.subscriptionStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Controle Financeiro SaaS & Assinantes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de planos (30 dias / teste de 3 dias), contas vencidas e cobrança via PIX com 1 clique.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenModal}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Novo Assinante / Usuário
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Métricas Financeiras SaaS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Assinaturas Ativas</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{assinantesAtivos}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Receita Mensal (MRR)</span>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(mrrTotal)}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Contas Vencidas
          </span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{contasVencidas}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-indigo-400 font-medium">Em Teste (3 Dias)</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{emTeste3Dias}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total de Contas</span>
          <p className="text-2xl font-bold text-slate-300 mt-1">{totalUsuarios}</p>
        </div>
      </div>

      {/* Busca e Filtros de Status */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar assinante por nome, e-mail ou instrumento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter('ativo')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'ativo'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Ativos ({assinantesAtivos})
          </button>
          <button
            onClick={() => setStatusFilter('vencido')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'vencido'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Vencidos ({contasVencidas})
          </button>
          <button
            onClick={() => setStatusFilter('teste')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'teste'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Testes 3d ({emTeste3Dias})
          </button>

          {/* Botão de Limpeza Rápida de Duplicados se houver repetições */}
          {users.some((u, idx) => users.findIndex((x) => x.email.toLowerCase() === u.email.toLowerCase()) !== idx) && (
            <button
              onClick={() => {
                if (window.confirm('Deseja remover as repetições e deixar apenas 1 usuário de cada e-mail?')) {
                  const seen = new Set<string>()
                  const unique = users.filter((u) => {
                    const k = u.email.toLowerCase()
                    if (seen.has(k)) return false
                    seen.add(k)
                    return true
                  })
                  localStorage.setItem('stageflow_users_v3', JSON.stringify(unique))
                  window.location.reload()
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 animate-pulse ml-auto"
              title="Limpar cadastros repetidos mantendo apenas 1"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-400" />
              Limpar Cadastros Repetidos
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Assinantes & Usuários */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-3 sm:px-4 py-3">Assinante / E-mail</th>
                <th className="px-3 sm:px-4 py-3">Plano & Status</th>
                <th className="px-3 sm:px-4 py-3">Vencimento</th>
                <th className="px-3 sm:px-4 py-3">Mensalidade</th>
                <th className="px-3 sm:px-4 py-3">WhatsApp</th>
                <th className="px-3 sm:px-4 py-3 text-right sticky right-0 bg-slate-950/95 backdrop-blur-md shadow-[-8px_0_12px_rgba(0,0,0,0.6)] z-10 min-w-[210px]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isCurrent = item.id === currentUser?.id
                  const daysRemaining = calculateDaysRemaining(item.expiresAt)
                  const isExpired = item.subscriptionStatus === 'vencido' || daysRemaining <= 0
                  const isTrial = item.subscriptionStatus === 'teste'
                  const isAdmin = item.role === 'admin'

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0e6f5c] to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {item.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white">{item.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium">
                                  Você
                                </span>
                              )}
                              {isAdmin && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                                  Dono
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Acesso Vitalício
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse">
                            <Lock className="w-3.5 h-3.5" /> Vencida
                          </span>
                        ) : isTrial ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                            <Clock className="w-3.5 h-3.5" /> Teste (3d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                          </span>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs">
                        {isAdmin ? (
                          <span className="text-slate-500">Ilimitado</span>
                        ) : (
                          <div>
                            <strong className="text-white block">{formatDate(item.expiresAt)}</strong>
                            <span
                              className={`text-[11px] font-medium ${
                                isExpired
                                  ? 'text-rose-400 font-bold'
                                  : daysRemaining <= 3
                                  ? 'text-amber-400 font-bold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {isExpired
                                ? 'Vencido!'
                                : `${daysRemaining} ${daysRemaining === 1 ? 'dia restante' : 'dias restantes'}`}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 py-3 font-mono font-bold text-xs text-white">
                        {isAdmin ? 'Isento' : formatCurrency(item.monthlyFee || 49.9)}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs text-slate-400">
                        {item.phone ? (
                          <span className="flex items-center gap-1 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-teal-400" />
                            {item.phone}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-right sticky right-0 bg-slate-900/95 backdrop-blur-md shadow-[-8px_0_12px_rgba(0,0,0,0.6)] z-10 min-w-[210px]">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isAdmin && (
                            <>
                              {/* Botão de Cobrança WhatsApp / PIX */}
                              <button
                                onClick={() => setBillingUser(item)}
                                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-1 text-xs font-semibold shrink-0"
                                title="Enviar Cobrança / PIX via WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">PIX</span>
                              </button>

                              {/* Botão de Renovação +30 Dias */}
                              <button
                                onClick={() => handleExtendSubscription(item.id, item.name)}
                                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-teal-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1 text-xs font-medium shrink-0"
                                title="Renovar +30 dias após pagamento"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                                <span className="hidden sm:inline">+30d</span>
                              </button>

                              {/* Excluir Usuário */}
                              {!isCurrent && (
                                <button
                                  onClick={() => handleDeleteUser(item.id, item.name)}
                                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-rose-400 hover:text-white bg-rose-500/15 hover:bg-rose-600 border border-rose-500/30 transition-all flex items-center gap-1 text-xs font-semibold shrink-0 shadow-sm"
                                  title="Excluir Usuário"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Excluir</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Usuário / Assinante */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-400" />
                  Cadastrar Novo Assinante / Usuário
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Crie acessos definidos para 30 dias (mensalidade) ou 3 dias de teste grátis.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <Input
                label="Nome Completo / Banda *"
                placeholder="Ex: Carlos Eduardo ou Banda Eclipse"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  label="E-mail de Login *"
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Senha de Acesso *"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Tipo de Plano / Tempo de Acesso */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Tempo de Acesso / Modelo de Assinatura *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPlanType('mensal_30_dias')
                      setMonthlyFee(49.9)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      planType === 'mensal_30_dias'
                        ? 'border-teal-500 bg-teal-500/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    <strong className="block text-xs text-white">30 Dias (Mensal)</strong>
                    <span className="block text-[10px] text-teal-300 mt-0.5">Pagou, usou</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPlanType('teste_3_dias')
                      setMonthlyFee(0)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      planType === 'teste_3_dias'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    <strong className="block text-xs text-white">Teste 3 Dias</strong>
                    <span className="block text-[10px] text-indigo-300 mt-0.5">Degustação grátis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPlanType('isento_admin')
                      setMonthlyFee(0)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      planType === 'isento_admin'
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    <strong className="block text-xs text-white">Equipe / Isento</strong>
                    <span className="block text-[10px] text-amber-300 mt-0.5">Sem cobrança</span>
                  </button>
                </div>
              </div>

              {planType === 'mensal_30_dias' && (
                <Input
                  label="Valor da Mensalidade (R$)"
                  type="number"
                  step="0.01"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  label="WhatsApp / Telefone"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Instrumento / Função"
                  placeholder="Ex: Teclado, Vocal, Locador"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Salvando na Nuvem...
                    </span>
                  ) : (
                    'Cadastrar Assinante'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cobrança PIX / WhatsApp */}
      {billingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                Lembrete de Pagamento PIX • {billingUser.name}
              </h3>
              <button onClick={() => setBillingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Envie esta mensagem pré-formatada para o WhatsApp do cliente contendo a sua chave PIX e valor da renovação:
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed select-text">
                {getBillingMessage(billingUser)}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleCopyMessage(billingUser)}
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? 'Mensagem Copiada!' : 'Copiar Texto'}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleSendWhatsApp(billingUser)}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Abrir no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
