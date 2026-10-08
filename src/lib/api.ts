let csrfToken: string | null = null
let csrfHeader = 'X-XSRF-TOKEN'

function readCookie(name: string): string | null {
  const prefix = `${name}=`
  const match = document.cookie.split('; ').find((row) => row.startsWith(prefix))
  return match ? decodeURIComponent(match.slice(prefix.length)) : null
}

async function ensureCsrf() {
  if (csrfToken) return
  const res = await fetch('/api/v1/auth/csrf', { credentials: 'include' })
  if (!res.ok) throw new Error('Unable to start a secure session')
  const body = (await res.json()) as { token: string; headerName: string }
  csrfHeader = body.headerName || csrfHeader
  csrfToken = readCookie('XSRF-TOKEN') || body.token
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    await ensureCsrf()
  }
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (csrfToken && method !== 'GET' && method !== 'HEAD') {
    headers.set(csrfHeader, csrfToken)
  }
  const res = await fetch(path, { ...init, headers, credentials: 'include' })
  if (res.status === 401) {
    csrfToken = null
    const isAuthBootstrap = path.includes('/auth/me') || path.includes('/auth/login') || path.includes('/auth/csrf')
    const onPublicAuthPage = typeof window !== 'undefined' && /^\/(login|register|forgot-password|reset-password)(\?|$)/.test(window.location.pathname)
    // Full reload here caused an endless restart loop on /login when /auth/me returned 401.
    if (!isAuthBootstrap && !onPublicAuthPage) {
      window.location.assign('/login')
    }
    throw new Error('Authentication required')
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

export function clearCsrf() {
  csrfToken = null
}
