import { useState } from 'react'
import { api } from '../lib/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <div className="min-h-screen grid place-items-center">
      <form
        className="bg-white p-8 rounded-lg w-full max-w-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          await api('/api/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
          setDone(true)
        }}
      >
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-slate-600">If an account exists, we will send a reset link. The response is the same either way.</p>
        <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button className="w-full bg-brand text-white rounded py-2">Send reset link</button>
        {done ? <p className="text-sm">If that account exists, check the local mail inbox.</p> : null}
      </form>
    </div>
  )
}

export function ResetPasswordPage() {
  const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token') ?? '')
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  return (
    <div className="min-h-screen grid place-items-center">
      <form
        className="bg-white p-8 rounded-lg w-full max-w-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          await api('/api/v1/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword: password }) })
          setDone(true)
        }}
      >
        <h1 className="text-xl font-semibold">Choose a new password</h1>
        <input className="w-full border rounded px-3 py-2" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Reset token" />
        <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
        <button className="w-full bg-brand text-white rounded py-2">Update password</button>
        {done ? <p className="text-sm">Password updated. You can sign in now.</p> : null}
      </form>
    </div>
  )
}
