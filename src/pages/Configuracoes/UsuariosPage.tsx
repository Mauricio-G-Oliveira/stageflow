import { useState, type FormEvent } from 'react'
import {
  UserPlus,
  Trash2,
  ShieldCheck,
  Music,
  Briefcase,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole, NewUserPayload } from '../../types/auth'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function UsuariosPage() {
  const { users, user: currentUser, addUser, removeUser } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('musico')
  const [instrument, setInstrument] = useState('')
  const [phone, setPhone] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleOpenModal = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('musico')
    setInstrument('')
    setPhone('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const payload: NewUserPayload = {
      name,
      email,
      password,
      role,
      instrument: instrument || undefined,
      phone: phone || undefined,
    }

    const result = addUser(payload)
    if (result.success) {
      setIsModalOpen(false)
      setSuccessMessage(`Usuário "${name}" cadastrado com sucesso!`)
      setTimeout(() => setSuccessMessage(null), 4000)
    } else {
      setFormError(result.error || 'Erro ao cadastrar usuário.')
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o acesso de "${userName}"?`)) {
      const result = removeUser(userId)
      if (!result.success) {
        alert(result.error)
      } else {
        setSuccessMessage(`Acesso de "${userName}" removido com sucesso.`)
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    }
  }

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.instrument && u.instrument.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === 'all' || u.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Role badges configuration
  const roleBadges: Record<UserRole, { label: string; bg: string; text: string; icon: typeof ShieldCheck }> = {
    admin: {
      label: 'Administrador',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400',
      icon: ShieldCheck,
    },
    musico: {
      label: 'Músico',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      text: 'text-indigo-400',
      icon: Music,
    },
    produtor: {
      label: 'Produção / Roadie',
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
      icon: Briefcase,
    },
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gestão de Usuários & Equipe
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cadastre novos músicos e membros da equipe com login e senha de acesso.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenModal}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Novo Usuário
        </Button>
      </div>

      {/* Success alert banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total de Membros</span>
          <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Administradores</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Músicos</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {users.filter((u) => u.role === 'musico').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Produção & Apoio</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {users.filter((u) => u.role === 'produtor').length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome, e-mail ou instrumento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'admin', 'musico', 'produtor'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                roleFilter === r
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r === 'all' ? 'Todos' : r === 'musico' ? 'Músicos' : r === 'admin' ? 'Admins' : 'Produção'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Integrante</th>
                <th className="px-6 py-4">Função / Perfil</th>
                <th className="px-6 py-4">Instrumento</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const badge = roleBadges[item.role]
                  const Icon = badge.icon
                  const initials = item.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                  const isCurrent = item.id === currentUser?.id

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0e6f5c] to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{item.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium">
                                  Você
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

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.bg} ${badge.text}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {item.instrument || <span className="text-slate-500">—</span>}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {item.phone ? (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            {item.phone}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(item.id, item.name)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Remover Acesso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#0e6f5c]" />
                  Cadastrar Novo Usuário
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Crie login e senha para o novo membro da equipe.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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

            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input
                label="Nome Completo *"
                placeholder="Ex: Carlos Eduardo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="E-mail de Acesso *"
                  type="email"
                  placeholder="carlos@banda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Senha Provisória *"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Perfil de Acesso *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'musico', label: 'Músico', desc: 'Acessa repertório e agenda' },
                    { id: 'admin', label: 'Admin', desc: 'Acesso total e gestão' },
                    { id: 'produtor', label: 'Produção', desc: 'Controle de palco/shows' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setRole(p.id as UserRole)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === p.id
                          ? 'border-[#0e6f5c] bg-[#0e6f5c]/10 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{p.label}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Instrumento Principal"
                  placeholder="Ex: Teclado, Bateria, Baixo"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                />

                <Input
                  label="Telefone / WhatsApp"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Salvar Usuário
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
