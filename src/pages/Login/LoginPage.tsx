import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Por favor, informe seu e-mail e senha de acesso.')
      return
    }

    const result = login({ email, password })
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error || 'Falha ao autenticar. Tente novamente.')
    }
  }

  // Helper button to quickly test login as Admin
  const handleQuickFill = (type: 'admin') => {
    setError(null)
    if (type === 'admin') {
      setEmail('mauriciogoulart.deoliveira37@gmail.com')
      setPassword('admin123')
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1.5 text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bem-vindo de volta!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Acesse para gerenciar eventos, equipe e repertório
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            required
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua senha secreta"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-200 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-[#0e6f5c] focus:ring-[#0e6f5c] focus:ring-offset-0"
              />
              <span>Lembrar de mim</span>
            </label>
            <span className="text-slate-500 hover:text-teal-400 cursor-pointer transition-colors">
              Esqueceu a senha?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
            className="mt-2"
          >
            Entrar no StageFlow
          </Button>
        </form>

        {/* Quick Test Login Helpers */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Preenchimento rápido para testes:</span>
          </div>

          <div className="max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-teal-500/50 hover:bg-teal-500/5 text-left transition-all text-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 group-hover:text-teal-300">
                  Entrar como Mauricio (Admin)
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                mauriciogoulart.deoliveira37@gmail.com
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
