import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './authContextInstance'
import type { User, UserWithPassword, LoginCredentials, NewUserPayload } from '../types/auth'

const STORAGE_USERS_KEY = 'stageflow_users_v1'
const STORAGE_CURRENT_USER_KEY = 'stageflow_current_user_v1'

const DEFAULT_USERS: UserWithPassword[] = [
  {
    id: 'usr-mauricio-admin',
    name: 'Mauricio G. Oliveira',
    email: 'mauriciogoulart.deoliveira37@gmail.com',
    password: 'admin123',
    role: 'admin',
    phone: '(11) 99999-9999',
    instrument: 'Direção Musical',
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'usr-lucas-musico',
    name: 'Lucas Mendes',
    email: 'musico@stageflow.com',
    password: 'musico123',
    role: 'musico',
    phone: '(11) 98888-8888',
    instrument: 'Guitarra Solo',
    createdAt: '2026-09-05T14:30:00.000Z',
  },
  {
    id: 'usr-roberta-produtora',
    name: 'Roberta Martins',
    email: 'producao@stageflow.com',
    password: 'prod123',
    role: 'produtor',
    phone: '(11) 97777-7777',
    instrument: 'Produção / Roadie',
    createdAt: '2026-09-10T09:15:00.000Z',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserWithPassword[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserWithPassword[]
        const hasMauricio = parsed.some((u) => u.email.toLowerCase() === DEFAULT_USERS[0].email.toLowerCase())
        if (!hasMauricio) {
          const updated = [DEFAULT_USERS[0], ...parsed]
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated))
          return updated
        }
        return parsed
      }
    } catch (e) {
      console.error('Erro ao ler usuários do localStorage:', e)
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS
  })

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY)
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

    const newUser: UserWithPassword = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password,
      role: payload.role,
      phone: payload.phone?.trim() || undefined,
      instrument: payload.instrument?.trim() || undefined,
      createdAt: new Date().toISOString(),
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
