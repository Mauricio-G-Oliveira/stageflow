export type UserRole = 'admin' | 'musico' | 'produtor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  instrument?: string
  avatar?: string
  createdAt: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface NewUserPayload {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  instrument?: string
}

export interface AuthContextType {
  user: User | null
  users: User[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => { success: boolean; error?: string }
  logout: () => void
  addUser: (payload: NewUserPayload) => { success: boolean; error?: string }
  removeUser: (userId: string) => { success: boolean; error?: string }
}
