import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { CurrentUser } from '../lib/types'

export function LoginPage() {
  const [email, setEmail] = useState('admin@dsms.local')
  const [password, setPassword] = useState('ChangeMe_Admin_123!')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { refresh } = useAuth()

  return (
    <div className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_40%),radial-gradient(circle_at_bottom_right,#dbeafe,transparent_35%),#eef2f4] px-4">
      <form
        className="dsms-card p-8 w-full max-w-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          try {
            await api<CurrentUser>('/api/v1/auth/login', {
              method: 'POST',
              body: JSON.stringify({ email, password }),
            })
            await refresh()
            navigate('/')
          } catch {
            setError('Invalid email or password')
          }
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="size-11 rounded-xl bg-brand text-white grid place-items-center font-extrabold">D</div>
          <div>
            <p className="font-extrabold tracking-wide">DSMS</p>
            <p className="text-xs text-muted">Support Operations</p>
          </div>
        </div>
        <h1 className="text-xl font-bold">Sign in</h1>
        <label className="block text-sm font-medium">
          Email
          <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input type="password" className="mt-1 w-full border border-line rounded-xl px-3 py-2.5" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-2.5 font-semibold">Sign in</button>
        <div className="flex justify-between text-sm">
          <a className="text-brand font-medium" href="/forgot-password">Forgot password</a>
          <a className="text-brand font-medium" href="/register">Create account</a>
        </div>
      </form>
    </div>
  )
}
