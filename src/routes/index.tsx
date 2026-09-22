import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout/DashboardLayout'
import { LoginPage } from '../pages/Login/LoginPage'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { UsuariosPage } from '../pages/Configuracoes/UsuariosPage'
import { AgendaPage } from '../pages/Agenda/AgendaPage'
import { BandasPage } from '../pages/Bandas/BandasPage'
import { EventosPage } from '../pages/Eventos/EventosPage'
import { MusicosPage } from '../pages/Musicos/MusicosPage'
import { RepertorioPage } from '../pages/Repertorio/RepertorioPage'
import { ConfiguracoesPage } from '../pages/Configuracoes/ConfiguracoesPage'

// Protected Route wrapper: requires user to be logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// Public-only Route wrapper: redirects already logged-in users away from /login
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        element={
          <PublicOnlyRoute>
            <AuthLayout />
          </PublicOnlyRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/bandas" element={<BandasPage />} />
        <Route path="/musicos" element={<MusicosPage />} />
        <Route path="/repertorio" element={<RepertorioPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
