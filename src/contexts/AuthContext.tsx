import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './authContextInstance'
import type { User, UserWithPassword, LoginCredentials, NewUserPayload } from '../types/auth'
import { apiRequest, setStoredToken, getStoredToken } from '../services/apiClient'

const STORAGE_USERS_KEY = 'stageflow_users_v3'
const STORAGE_CURRENT_USER_KEY = 'stageflow_current_user_v3'

const DEFAULT_ADMIN: UserWithPassword = {
  id: 'usr-mauricio-admin',
  name: 'Mauricio G. Oliveira',
  email: 'mauriciogoulart.deoliveira37@gmail.com',
  password: '', // Autenticado com hash seguro no banco de dados na nuvem
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

interface CloudLoginResponse {
  token: string
  tokenType: string
  user: {
    id: string
    name: string
    email: string
    role: string
    phone?: string
    instrument?: string
    planType?: string
    subscriptionStatus?: string
    monthlyFee?: number
    expiresAt?: string
    lastPaymentDate?: string
    createdAt?: string
  }
}

interface CloudUserResponse {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  instrument?: string
  planType?: string
  subscriptionStatus?: string
  monthlyFee?: number
  expiresAt?: string
  lastPaymentDate?: string
  createdAt?: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserWithPassword[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY) || localStorage.getItem('stageflow_users_v2')
      if (stored) {
        const parsed = JSON.parse(stored) as UserWithPassword[]
        const now = new Date()

        const updated = parsed.map((u) => {
          if (u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
            return {
              ...u,
              name: 'Mauricio G. Oliveira',
              password: u.password || '',
              role: 'admin' as const,
              planType: 'isento_admin' as const,
              subscriptionStatus: 'isento' as const,
              expiresAt: '2099-12-31T23:59:59.000Z',
            }
          }

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

  // Sincroniza lista de usuários com o banco PostgreSQL no Supabase quando logado como admin
  useEffect(() => {
    async function syncCloudUsers() {
      const token = getStoredToken()
      if (!token || currentUser?.role !== 'admin') return

      try {
        const cloudUsers = await apiRequest<CloudUserResponse[]>('/usuarios')
        if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          setUsers((prev) => {
            const merged = [...prev]
            cloudUsers.forEach((cu) => {
              const existingIdx = merged.findIndex(
                (u) => u.email.toLowerCase() === cu.email.toLowerCase() || u.id === cu.id,
              )
              const mappedUser: UserWithPassword = {
                id: cu.id,
                name: cu.name,
                email: cu.email,
                password: '••••••••', // Senha protegida no hash
                role: cu.role.toLowerCase() === 'admin' ? 'admin' : 'musico',
                phone: cu.phone,
                instrument: cu.instrument,
                createdAt: cu.createdAt || new Date().toISOString(),
                planType: (cu.planType?.toLowerCase() as any) || 'mensal_30_dias',
                subscriptionStatus: (cu.subscriptionStatus?.toLowerCase() as any) || 'ativo',
                monthlyFee: cu.monthlyFee ?? 49.9,
                expiresAt: cu.expiresAt || calculateExpirationDate(30),
                lastPaymentDate: cu.lastPaymentDate,
                paymentStatus: 'pago',
              }

              if (existingIdx >= 0) {
                merged[existingIdx] = {
                  ...merged[existingIdx],
                  ...mappedUser,
                  // Mantém senha local existente
                  password: merged[existingIdx].password || '',
                }
              } else {
                merged.push(mappedUser)
              }
            })
            return merged
          })
        }
      } catch (err) {
        console.warn('Backend na nuvem temporariamente indisponível para sincronização de usuários:', err)
      }
    }

    syncCloudUsers()
  }, [currentUser])

  const login = async ({ email, password }: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    const normalizedEmail = email.trim().toLowerCase()

    // 1. Tenta autenticar diretamente na API Spring Boot na Nuvem (Render + Supabase)
    try {
      const cloudRes = await apiRequest<CloudLoginResponse>('/auth/login', {
        method: 'POST',
        data: {
          email: normalizedEmail,
          password: password,
        },
      })

      if (cloudRes && cloudRes.token && cloudRes.user) {
        setStoredToken(cloudRes.token)
        const cu = cloudRes.user
        const mappedUser: User = {
          id: cu.id,
          name: cu.name,
          email: cu.email,
          role: cu.role.toLowerCase() === 'admin' ? 'admin' : 'musico',
          phone: cu.phone,
          instrument: cu.instrument,
          createdAt: cu.createdAt || new Date().toISOString(),
          planType: (cu.planType?.toLowerCase() as any) || 'mensal_30_dias',
          subscriptionStatus: (cu.subscriptionStatus?.toLowerCase() as any) || 'ativo',
          monthlyFee: cu.monthlyFee ?? 0,
          expiresAt: cu.expiresAt || '2099-12-31T23:59:59.000Z',
          lastPaymentDate: cu.lastPaymentDate,
          paymentStatus: 'pago',
        }

        setCurrentUser(mappedUser)
        setIsLoading(false)
        return { success: true }
      }
    } catch (cloudErr) {
      console.warn('Autenticação na nuvem indisponível ou falhou, testando credenciais locais:', cloudErr)
    }

    // 2. Fallback local / offline caso a nuvem esteja inicializando ou sem conexão
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
    setStoredToken(null)
    setCurrentUser(null)
  }

  const addUser = async (payload: NewUserPayload): Promise<{ success: boolean; error?: string }> => {
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

    let cloudId: string | null = null

    // 1. Envia para o banco de dados PostgreSQL no Supabase através da API
    try {
      const regRes = await apiRequest<CloudUserResponse>('/auth/register', {
        method: 'POST',
        data: {
          name: payload.name.trim(),
          email: normalizedEmail,
          password: payload.password,
          role: payload.role.toUpperCase(),
          phone: payload.phone?.trim() || null,
          instrument: payload.instrument?.trim() || null,
          planType: planType.toUpperCase(),
          customDays: days,
          monthlyFee: fee,
        },
      })
      if (regRes && regRes.id) {
        cloudId = regRes.id
      }
    } catch (err) {
      console.warn('Erro ao salvar usuário no banco na nuvem, mantendo no storage local:', err)
    }

    const newUser: UserWithPassword = {
      id: cloudId || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

  const removeUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.id === userId) {
      return { success: false, error: 'Você não pode excluir o seu próprio usuário logado.' }
    }

    try {
      await apiRequest(`/usuarios/${userId}`, { method: 'DELETE' })
    } catch (err) {
      console.warn('Não foi possível remover no backend da nuvem:', err)
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId))
    return { success: true }
  }

  const extendAccess = async (userId: string, days = 30, fee?: number): Promise<{ success: boolean; error?: string }> => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) {
      return { success: false, error: 'Usuário não encontrado.' }
    }

    const now = new Date()
    const currentExp = new Date(targetUser.expiresAt)
    const baseDate = currentExp > now ? currentExp : now
    baseDate.setDate(baseDate.getDate() + days)

    try {
      await apiRequest(`/usuarios/${userId}/renovar`, {
        method: 'POST',
        data: { dias: days },
      })
    } catch (err) {
      console.warn('Não foi possível sincronizar renovação na nuvem:', err)
    }

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

  const changePassword = async (userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' }
    }

    try {
      await apiRequest(`/usuarios/${userId}/senha`, {
        method: 'PATCH',
        data: { novaSenha: newPassword },
      })
    } catch (err) {
      console.warn('Não foi possível alterar a senha na nuvem:', err)
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

  const toggleUserStatus = async (userId: string): Promise<{ success: boolean; error?: string }> => {
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
