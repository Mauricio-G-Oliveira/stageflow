import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './authContextInstance'
import type { User, UserWithPassword, LoginCredentials, NewUserPayload } from '../types/auth'

const STORAGE_USERS_KEY = 'stageflow_users_v3'
const STORAGE_CURRENT_USER_KEY = 'stageflow_current_user_v3'

const DEFAULT_ADMIN: UserWithPassword = {
  id: 'usr-mauricio-admin',
  name: 'Mauricio G. Oliveira',
  email: 'mauriciogoulart.deoliveira37@gmail.com',
  password: 'xb100pro2815',
  role: 'admin',
  phone: '(11) 99999-9999',
  instrument: 'Direção Musical / Baixo',
  createdAt: '2026-09-01T10:00:00.000Z',
  planType: 'isento_admin',
  subscriptionStatus: 'isento',
  monthlyFee: 0,
  expiresAt: '2099-12-31T23:59:59.000Z',
  lastPaymentDate: '2026-09-01T10:00:00.000Z',
  paymentStatus: 'pago',
}

function calculateExpirationDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserWithPassword[]>(() => {
    try {
      // Check both current v3 key and older v2 key for migration
      const stored = localStorage.getItem(STORAGE_USERS_KEY) || localStorage.getItem('stageflow_users_v2')
      if (stored) {
        const parsed = JSON.parse(stored) as UserWithPassword[]
        const now = new Date()

        // Sincroniza ou adiciona o Administrador Mauricio com a senha xb100pro2815
        const updated = parsed.map((u) => {
          if (u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
            return {
              ...u,
              name: 'Mauricio G. Oliveira',
              password: 'xb100pro2815',
              role: 'admin' as const,
              planType: 'isento_admin' as const,
              subscriptionStatus: 'isento' as const,
              expiresAt: '2099-12-31T23:59:59.000Z',
            }
          }

          // Checa vencimento de contas para usuários comuns
          const expiresAt = u.expiresAt || calculateExpirationDate(30)
          const isExpired = new Date(expiresAt) < now && u.role !== 'admin'
          return {
            ...u,
            planType: u.planType || 'mensal_30_dias',
            subscriptionStatus: isExpired ? ('vencido' as const) : (u.subscriptionStatus || 'ativo'),
            monthlyFee: u.monthlyFee ?? 49.9,
            expiresAt,
            paymentStatus: isExpired ? ('atrasado' as const) : (u.paymentStatus || 'pago'),
          }
        })

        const hasAdmin = updated.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase())
        const finalList = hasAdmin ? updated : [DEFAULT_ADMIN, ...updated]
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(finalList))
        return finalList
      }
    } catch (e) {
      console.error('Erro ao ler usuários do localStorage:', e)
    }

    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([DEFAULT_ADMIN]))
    return [DEFAULT_ADMIN]
  })

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY) || localStorage.getItem('stageflow_current_user_v2')
      if (stored) {
        return JSON.parse(stored) as User
      }
    } catch (e) {
      console.error('Erro ao ler sessão do localStorage:', e)
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
    } catch (e) {
      console.error('Erro ao salvar usuários no localStorage:', e)
    }
  }, [users])

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser))
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
      }
    } catch (e) {
      console.error('Erro ao salvar sessão no localStorage:', e)
    }
  }, [currentUser])

  const login = ({ email, password }: LoginCredentials) => {
    setIsLoading(true)
    const normalizedEmail = email.trim().toLowerCase()
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
    )

    setIsLoading(false)

    if (!foundUser) {
      return { success: false, error: 'E-mail ou senha inválidos. Verifique suas credenciais.' }
    }

    const { password: _pw, ...userWithoutPassword } = foundUser
    void _pw
    setCurrentUser(userWithoutPassword)
    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const addUser = (payload: NewUserPayload) => {
    const normalizedEmail = payload.email.trim().toLowerCase()
    const emailExists = users.some((u) => u.email.toLowerCase() === normalizedEmail)

    if (emailExists) {
      return { success: false, error: 'Já existe um usuário cadastrado com este e-mail.' }
    }

    if (!payload.name.trim() || !payload.email.trim() || !payload.password.trim()) {
      return { success: false, error: 'Nome, e-mail e senha são campos obrigatórios.' }
    }

    if (payload.password.length < 6) {
      return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' }
    }

    const planType = payload.planType || 'mensal_30_dias'
    const days = payload.customDays || (planType === 'teste_3_dias' ? 3 : 30)
    const fee = planType === 'teste_3_dias' ? 0 : payload.monthlyFee ?? 49.9
    const status = payload.role === 'admin' ? 'isento' : planType === 'teste_3_dias' ? 'teste' : 'ativo'

    const newUser: UserWithPassword = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password,
      role: payload.role,
      phone: payload.phone?.trim() || undefined,
      instrument: payload.instrument?.trim() || undefined,
      createdAt: new Date().toISOString(),
      planType,
      subscriptionStatus: status,
      monthlyFee: fee,
      expiresAt: payload.role === 'admin' ? '2099-12-31T23:59:59.000Z' : calculateExpirationDate(days),
      lastPaymentDate: planType === 'teste_3_dias' ? undefined : new Date().toISOString(),
      paymentStatus: planType === 'teste_3_dias' ? 'pendente' : 'pago',
    }

    setUsers((prev) => [...prev, newUser])
    return { success: true }
  }

  const removeUser = (userId: string) => {
    if (currentUser?.id === userId) {
      return { success: false, error: 'Você não pode excluir o seu próprio usuário logado.' }
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId))
    return { success: true }
  }

  const extendAccess = (userId: string, days = 30, fee?: number) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) {
      return { success: false, error: 'Usuário não encontrado.' }
    }

    const now = new Date()
    const currentExp = new Date(targetUser.expiresAt)
    // Se ainda não venceu, soma 30 dias na data final. Se já venceu, soma 30 dias a partir de hoje.
    const baseDate = currentExp > now ? currentExp : now
    baseDate.setDate(baseDate.getDate() + days)

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            subscriptionStatus: 'ativo',
            paymentStatus: 'pago',
            expiresAt: baseDate.toISOString(),
            lastPaymentDate: new Date().toISOString(),
            monthlyFee: fee !== undefined ? fee : u.monthlyFee,
          }
        }
        return u
      }),
    )

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              subscriptionStatus: 'ativo',
              paymentStatus: 'pago',
              expiresAt: baseDate.toISOString(),
              lastPaymentDate: new Date().toISOString(),
            }
          : null,
      )
    }

    return { success: true }
  }

  const changePassword = (userId: string, newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' }
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, password: newPassword }
        }
        return u
      }),
    )

    return { success: true }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.subscriptionStatus === 'ativo' ? 'vencido' : 'ativo'
          return { ...u, subscriptionStatus: nextStatus }
        }
        return u
      }),
    )
    return { success: true }
  }

  const publicUsers: User[] = users.map((u) => {
    const copy = { ...u } as Partial<UserWithPassword>
    delete copy.password
    return copy as User
  })

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        users: publicUsers,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        addUser,
        removeUser,
        extendAccess,
        changePassword,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
