export type UserRole = 'admin' | 'musico' | 'produtor'

export type SubscriptionStatus = 'ativo' | 'vencido' | 'teste' | 'isento'
export type PlanType = 'mensal_30_dias' | 'teste_3_dias' | 'isento_admin'
export type PaymentStatus = 'pago' | 'pendente' | 'atrasado'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  instrument?: string
  avatar?: string
  createdAt: string

  // SaaS Subscription & Financial Control
  planType: PlanType
  subscriptionStatus: SubscriptionStatus
  monthlyFee: number
  expiresAt: string // ISO date de vencimento
  lastPaymentDate?: string
  paymentStatus?: PaymentStatus
  notes?: string
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
  planType?: PlanType
  monthlyFee?: number
  customDays?: number // ex: 30 dias para mensal ou 3 dias para teste
}

export interface AuthContextType {
  user: User | null
  users: User[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  addUser: (payload: NewUserPayload) => Promise<{ success: boolean; error?: string }>
  removeUser: (userId: string) => Promise<{ success: boolean; error?: string }>
  extendAccess: (userId: string, days?: number, fee?: number) => Promise<{ success: boolean; error?: string }>
  changePassword: (userId: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  toggleUserStatus: (userId: string) => Promise<{ success: boolean; error?: string }>
}
