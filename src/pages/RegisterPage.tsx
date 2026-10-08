import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { CurrentUser } from '../lib/types'

type RegisterRole = 'CANDIDATE' | 'EXPERT'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<RegisterRole>('CANDIDATE')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { refresh } = useAuth()

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          if (password.length < 10) {
            setError('Password must be at least 10 characters')
            return
          }
          try {
            await api<CurrentUser>('/api/v1/auth/register', {
              method: 'POST',
              body: JSON.stringify({ email, password, displayName, role }),
            })
            await refresh()
            navigate('/')
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
          }
        }}
      >
        <h1 className="text-xl font-semibold text-brand">Create a DSMS account</h1>
        <p className="text-sm text-slate-600">
          Register as a Candidate or Expert. An admin can later grant Coordinator permission to manage day-to-day work.
        </p>
        <label className="block text-sm">
          Full name
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            type="email"
            className="mt-1 w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            className="mt-1 w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={10}
            required
          />
        </label>
        <label className="block text-sm">
          I am registering as
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as RegisterRole)}
          >
            <option value="CANDIDATE">Candidate</option>
            <option value="EXPERT">Expert</option>
          </select>
        </label>
        {error ? <p className="text-sm text-red-600 break-words">{error}</p> : null}
        <button className="w-full bg-brand text-white rounded py-2">Create account</button>
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="text-brand" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
