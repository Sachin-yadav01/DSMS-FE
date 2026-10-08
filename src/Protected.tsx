import { Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import { AppShell } from './AppShell'
import type { ReactNode } from 'react'

export function Protected({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-8 text-sm">Loading session…</p>
  if (!user) return <Navigate to="/login" replace />
  return children ? <>{children}</> : <AppShell />
}
