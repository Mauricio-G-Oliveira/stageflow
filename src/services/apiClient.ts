const DEFAULT_API_URL = 'https://stageflow-backend-0qi8.onrender.com/api/v1'

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL

export const TOKEN_STORAGE_KEY = 'stageflow_jwt_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

// Pre-aquecimento e Keep-Alive automático para manter o servidor no Render sempre acordado e veloz
export function warmUpBackend() {
  try {
    fetch(`${API_URL}/auth/me`, { method: 'GET' }).catch(() => {})
  } catch {
    // silencioso
  }
}

// Inicia aquecimento imediato e repete a cada 10 minutos enquanto a aba estiver aberta
warmUpBackend()
if (typeof window !== 'undefined') {
  setInterval(warmUpBackend, 10 * 60 * 1000)
}

interface RequestOptions extends RequestInit {
  data?: unknown
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers = {}, ...rest } = options

  const token = getStoredToken()

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const errorMessage = errorBody?.message || errorBody?.error || `Erro HTTP ${response.status}: ${response.statusText}`
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json() as Promise<T>
}
