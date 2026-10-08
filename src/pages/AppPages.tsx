import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Columns3,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  History,
  IndianRupee,
  Info,
  Link2,
  Moon,
  MoreVertical,
  Pencil,
  Phone,
  Play,
  Plus,
  Power,
  RefreshCw,
  Search,
  Sun,
  Timer,
  User,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { PageHeader } from '../AppShell'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { cn } from '../lib/utils'
import type {
  Candidate,
  CandidatePayment,
  DailySheet,
  Engagement,
  Expert,
  Invoice,
  NotificationItem,
  PageResponse,
  Payout,
  Skill,
  SupporterPayment,
  WorkEntry,
} from '../lib/types'

function MetricCard({
  title,
  value,
  icon,
  tone = 'brand',
}: {
  title: string
  value: string | number
  icon: ReactNode
  tone?: 'green' | 'blue' | 'violet' | 'orange' | 'rose' | 'sky' | 'brand'
}) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
    rose: 'bg-rose-50 text-rose-600',
    sky: 'bg-sky-50 text-sky-600',
    brand: 'bg-brand-soft text-brand',
  }
  return (
    <div className="dsms-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-slate-800">{value}</p>
          <p className="text-xs font-medium text-muted mt-1">{title}</p>
        </div>
        <div className={cn('size-10 rounded-xl grid place-items-center shrink-0', tones[tone])}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'
}

function Card({
  title,
  value,
  hint,
  icon,
}: {
  title: string
  value: string | number
  hint?: string
  icon?: ReactNode
}) {
  return (
    <div className="dsms-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted" title={hint}>{title}</p>
          <p className="text-2xl font-extrabold mt-2 tracking-tight">{value}</p>
          {hint ? <p className="text-[11px] text-slate-400 mt-1">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="size-10 rounded-xl bg-brand-soft text-brand grid place-items-center shrink-0">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function StatusChip({ status }: { status: string }) {
  const tone =
    status === 'PENDING' || status === 'MISSED' || status === 'SCHEDULED'
      ? 'bg-amber-100 text-amber-800'
      : status === 'RUNNING' || status === 'ACTIVE' || status === 'COMPLETED'
        ? 'bg-emerald-100 text-emerald-800'
        : status === 'PAUSED' || status === 'ON_HOLD'
          ? 'bg-orange-100 text-orange-800'
          : status === 'NOT_STARTED' || status === 'DRAFT'
            ? 'bg-slate-100 text-slate-600'
            : 'bg-sky-100 text-sky-800'
  const label = status.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  return <span className={cn('dsms-chip', tone)}>{label}</span>
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#25D366"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.48.64 2.07.7 2.81.59.43-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z"
      />
    </svg>
  )
}

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="5" width="14.5" height="12" rx="2.5" fill="#2D8CFF" />
      <path fill="#2D8CFF" d="M17.2 9.2 22 6.4v11.2l-4.8-2.8V9.2z" />
      <rect x="4.2" y="8.2" width="7.2" height="5.6" rx="1.2" fill="#fff" />
    </svg>
  )
}

function GoogleMeetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#00832D" d="M12.5 10.5V6.8h5.2l2.1 2.1v1.6z" />
      <path fill="#0066DA" d="M3.5 6.8h9v10.4h-9A1.8 1.8 0 0 1 1.7 15.4V8.6a1.8 1.8 0 0 1 1.8-1.8z" />
      <path fill="#E37400" d="M12.5 17.2V12.9h7.3v2.5a1.8 1.8 0 0 1-1.8 1.8z" />
      <path fill="#2684FC" d="m17.7 6.8 3.5 3.5h-3.5z" />
      <path fill="#00AC47" d="M17.7 17.2h3.5l-1.7-1.7-1.8-1.8z" />
      <path fill="#FFBA00" d="M19.8 12.9h2.5v2.5h-2.5z" />
    </svg>
  )
}

function meetingPlatform(url: string | null | undefined): 'ZOOM' | 'GOOGLE_MEET' | 'OTHER' {
  if (!url) return 'OTHER'
  const lower = url.toLowerCase()
  if (lower.includes('zoom.us') || lower.includes('zoom.com')) return 'ZOOM'
  if (lower.includes('meet.google.com') || lower.includes('google.com/meet')) return 'GOOGLE_MEET'
  return 'OTHER'
}

function avatarTone(name: string) {
  const tones = ['bg-violet-100 text-violet-700', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700', 'bg-emerald-100 text-emerald-700']
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i)) % tones.length
  return tones[hash]
}

function formatShortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function formatLongMonth(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function formatInrAmount(value: string | number, digits = 0) {
  const n = typeof value === 'number' ? value : Number(value)
  return `₹${(Number.isFinite(n) ? n : 0).toLocaleString('en-IN', { maximumFractionDigits: digits })}`
}

function paymentStatusLabel(status: string) {
  if (status === 'PARTIAL') return 'Partially paid'
  if (status === 'PENDING') return 'Unpaid'
  if (status === 'DRAFT') return 'Draft'
  if (status === 'OVERDUE') return 'Overdue'
  if (status === 'PAID') return 'Paid'
  if (status === 'WAIVED') return 'Waived'
  return status.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
}

function paymentStatusTone(status: string) {
  if (status === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (status === 'PARTIAL') return 'bg-orange-50 text-orange-700 border-orange-100'
  if (status === 'DRAFT') return 'bg-slate-100 text-slate-600 border-slate-200'
  if (status === 'OVERDUE' || status === 'PENDING') return 'bg-rose-50 text-rose-700 border-rose-100'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function paymentStatusDot(status: string) {
  if (status === 'PAID') return 'bg-emerald-500'
  if (status === 'PARTIAL') return 'bg-orange-500'
  if (status === 'DRAFT') return 'bg-slate-400'
  return 'bg-rose-500'
}

function modelLabel(model: string) {
  if (model === 'HOURLY') return 'Hourly'
  if (model === 'FIXED_MONTHLY') return 'Fixed monthly'
  if (model === 'PER_CANDIDATE') return 'Per candidate'
  if (model === 'CUSTOM') return 'Custom'
  return model
}

export function ResourceTable<T extends { id: string }>({
  title,
  rows,
  columns,
  actions,
}: {
  title: string
  rows: T[] | undefined
  columns: Array<{ key: keyof T | string; label: string; render?: (row: T) => ReactNode }>
  actions?: ReactNode
}) {
  return (
    <section className="dsms-card overflow-hidden">
      <header className="px-5 py-4 border-b border-line flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        {actions}
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((c) => (
                <th key={c.label} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows || rows.length === 0 ? (
              <tr><td className="px-5 py-8 text-muted" colSpan={columns.length}>No records yet.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-t border-line hover:bg-slate-50/70">
                {columns.map((c) => (
                  <td key={c.label} className="px-5 py-3.5 whitespace-nowrap">
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL')
  const [sheetQ, setSheetQ] = useState('')
  const dash = useQuery({ queryKey: ['dashboard'], queryFn: () => api<Record<string, unknown>>('/api/v1/dashboards/me') })
  const sheet = useQuery({
    queryKey: ['daily-sheet', date],
    queryFn: () => api<DailySheet>(`/api/v1/daily-sheet?date=${date}`),
  })
  const candidates = useQuery({
    queryKey: ['candidates-dash'],
    queryFn: () => api<PageResponse<Candidate>>('/api/v1/candidates?size=100'),
  })

  if (dash.isError) {
    return (
      <div className="dsms-card p-6">
        Unable to load dashboard. <button className="text-brand underline" onClick={() => dash.refetch()}>Retry</button>
      </div>
    )
  }

  const d = dash.data
  const shift = (days: number) => {
    const next = new Date(`${date}T00:00:00`)
    next.setDate(next.getDate() + days)
    setDate(next.toISOString().slice(0, 10))
  }

  const rows = (sheet.data?.rows ?? [])
    .filter((r) => {
      if (filter === 'PENDING') return r.dayStatus === 'PENDING' || r.dayStatus === 'MISSED'
      if (filter === 'COMPLETED') return r.dayStatus === 'COMPLETED'
      return true
    })
    .filter((r) => {
      if (!sheetQ.trim()) return true
      const q = sheetQ.toLowerCase()
      return r.candidateName.toLowerCase().includes(q)
        || (r.technology ?? '').toLowerCase().includes(q)
        || (r.supporterName ?? '').toLowerCase().includes(q)
    })

  const notStartedCount = (candidates.data?.items ?? []).filter((c) => c.status === 'NOT_STARTED').length
  const pendingToday = Number(d?.pendingToday ?? sheet.data?.summary.pending ?? 0)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="A clear view of your support operations."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium">
              <CalendarDays className="size-4 text-brand" />
              {formatShortDate(date)}
            </button>
            <button
              className="rounded-xl border border-brand text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft"
              onClick={() => navigate('/daily-sheet')}
            >
              Open daily sheet
            </button>
            {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') ? (
              <button
                className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark"
                onClick={() => navigate('/candidates')}
              >
                + Add candidate
              </button>
            ) : null}
          </>
        }
      />

      {dash.isLoading || !d ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <Card title="Total candidates" value={Number(d.totalCandidates ?? 0)} hint="All registered candidates" icon={<Users className="size-4" />} />
            <Card title="Active support" value={Number(d.activeSupport ?? 0)} hint="Currently receiving support" icon={<Play className="size-4" />} />
            <Card title="Supporters" value={Number(d.supporters ?? 0)} hint="In your supporter network" icon={<UserPlus className="size-4" />} />
            <Card title="This month" value={String(d.thisMonthHours ?? '0h 00m')} hint="Total support hours" icon={<Clock3 className="size-4" />} />
          </div>

          <div className="dsms-card px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Today {formatShortDate(date)}</p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-ok" />
              Running now: <strong>{Number(d.runningNow ?? 0)}</strong>
            </div>
            <div className="inline-flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-brand" />
              Supported today: <strong>{Number(d.supportedToday ?? 0)}</strong>
            </div>
            <div className="inline-flex items-center gap-2 text-sm">
              <Clock3 className="size-4 text-warn" />
              Pending today: <strong>{pendingToday}</strong>
            </div>
            <div className="inline-flex items-center gap-2 text-sm">
              Today&apos;s hours: <strong>{String(d.todaysHours ?? '0h 00m')}</strong>
            </div>
            <Link to="/daily-sheet" className="ml-auto text-sm font-semibold text-brand hover:underline">
              View sheet →
            </Link>
          </div>

          <div className="grid xl:grid-cols-[1fr_300px] gap-4">
            <section className="dsms-card overflow-hidden">
              <header className="px-5 py-4 border-b border-line flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold">Today&apos;s support sheet</h2>
                  <span className="dsms-chip bg-sky-100 text-sky-800">Live records</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="size-8 rounded-lg border border-line grid place-items-center" onClick={() => shift(-1)}>
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-sm font-semibold min-w-20 text-center">{formatShortDate(date)}</span>
                  <button className="size-8 rounded-lg border border-line grid place-items-center" onClick={() => shift(1)}>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </header>
              <div className="px-5 py-3 border-b border-line flex flex-wrap gap-2 items-center justify-between">
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
                  {([
                    ['ALL', 'All candidates'],
                    ['PENDING', 'Pending'],
                    ['COMPLETED', 'Completed'],
                  ] as const).map(([key, label]) => (
                    <button
                      key={key}
                      className={cn(
                        'rounded-lg px-3 py-1.5 font-medium',
                        filter === key ? 'bg-white shadow-sm text-ink' : 'text-muted',
                      )}
                      onClick={() => setFilter(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  className="rounded-xl border border-line px-3 py-2 text-sm w-56"
                  placeholder="Search sheet..."
                  value={sheetQ}
                  onChange={(e) => setSheetQ(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/80">
                    <tr>
                      {['Candidate', 'Technology', 'Supporter', 'WhatsApp group', 'Status', 'Action'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr><td className="px-5 py-8 text-muted" colSpan={6}>No candidates on this date.</td></tr>
                    ) : rows.map((r) => (
                      <tr key={r.candidateId} className="border-t border-line">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={cn('size-9 rounded-full grid place-items-center text-xs font-bold', avatarTone(r.candidateName))}>
                              {r.candidateName.slice(0, 1)}
                            </div>
                            <Link to={`/candidates/${r.candidateId}`} className="font-semibold hover:text-brand">
                              {r.candidateName}
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {r.technology ? <span className="dsms-chip bg-sky-100 text-sky-800">{r.technology}</span> : '-'}
                        </td>
                        <td className="px-5 py-3.5">
                          {r.supporterName ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="size-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[10px] font-bold">
                                {r.supporterName.slice(0, 1)}
                              </span>
                              {r.supporterName}
                            </span>
                          ) : <span className="text-muted">Unassigned</span>}
                        </td>
                        <td className="px-5 py-3.5 text-muted">{r.groupName ?? 'Not linked'}</td>
                        <td className="px-5 py-3.5"><StatusChip status={r.dayStatus} /></td>
                        <td className="px-5 py-3.5">
                          {r.supporterId ? (
                            <button
                              className="rounded-lg border border-brand text-brand px-3 py-1.5 text-xs font-semibold hover:bg-brand-soft"
                              onClick={() => navigate('/daily-sheet')}
                            >
                              Start
                            </button>
                          ) : (
                            <button
                              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                              onClick={() => navigate('/assignments')}
                            >
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <footer className="px-5 py-3 border-t border-line flex items-center justify-between text-sm text-muted">
                <span>Showing {rows.length} candidates</span>
                <Link to="/candidates" className="font-semibold text-brand hover:underline">View all candidates →</Link>
              </footer>
            </section>

            <div className="space-y-4">
              <section className="dsms-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-full bg-amber-100 text-amber-700 grid place-items-center">
                    <Clock3 className="size-4" />
                  </div>
                  <h3 className="font-semibold">Needs attention</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <Link to="/daily-sheet" className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 hover:bg-slate-100">
                    <span>{pendingToday} session{pendingToday === 1 ? '' : 's'} pending</span>
                    <span className="text-brand font-semibold">Review</span>
                  </Link>
                  <Link to="/assignments" className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 hover:bg-slate-100">
                    <span>{notStartedCount} candidate activation{notStartedCount === 1 ? '' : 's'}</span>
                    <span className="text-brand font-semibold">Open</span>
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl bg-brand text-white p-5 shadow-lg shadow-teal-900/10">
                <div className="size-10 rounded-xl bg-white/15 grid place-items-center mb-3">
                  <CalendarDays className="size-5" />
                </div>
                <h3 className="font-bold text-lg leading-snug">Keep your daily sheet up to date</h3>
                <p className="text-sm text-teal-50/90 mt-2">Record support time and notes in one place.</p>
                <Link to="/daily-sheet" className="inline-flex mt-4 text-sm font-semibold underline underline-offset-4">
                  Open daily sheet →
                </Link>
              </section>
            </div>
          </div>

          {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') ? (
            <section className="dsms-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Financial overview</h3>
                  <p className="text-xs text-muted mt-0.5">{formatLongMonth(date)}</p>
                </div>
                <Link to="/candidate-payments" className="text-sm font-semibold text-brand hover:underline">View payments →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Invoiced', value: d.invoicedAmount, icon: <CircleDollarSign className="size-4" /> },
                  { label: 'Collected', value: d.collectedAmount, icon: <IndianRupee className="size-4" /> },
                  { label: 'Expert earnings', value: d.expertEarnings, icon: <Wallet className="size-4" /> },
                  { label: 'Unpaid payouts', value: d.unpaidPayouts, icon: <Wallet className="size-4" /> },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-line bg-slate-50/70 p-4">
                    <div className="size-9 rounded-lg bg-white border border-line text-brand grid place-items-center mb-3">
                      {item.icon}
                    </div>
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="text-lg font-extrabold mt-1">₹{String(item.value ?? '0')}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}

export function CandidatesPage() {
  const qc = useQueryClient()
  const initialQ = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') ?? '' : ''
  const [q, setQ] = useState(initialQ)
  const [status, setStatus] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPhone, setEditingPhone] = useState<string | null>(null)
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [consultancyName, setConsultancyName] = useState('')
  const [whatsappGroupName, setWhatsappGroupName] = useState('')
  const [whatsappGroupLink, setWhatsappGroupLink] = useState('')
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [techQuery, setTechQuery] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['candidates', q, status],
    queryFn: () => api<PageResponse<Candidate>>(`/api/v1/candidates?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&size=100`),
  })
  const skills = useQuery({ queryKey: ['skills'], queryFn: () => api<Skill[]>('/api/v1/skills') })

  const resetForm = () => {
    setEditingId(null)
    setEditingPhone(null)
    setEditingEmail(null)
    setFullName('')
    setConsultancyName('')
    setWhatsappGroupName('')
    setWhatsappGroupLink('')
    setSelectedSkillIds([])
    setTechQuery('')
    setMsg(null)
  }

  const startEdit = (candidate: Candidate) => {
    setShowForm(true)
    setEditingId(candidate.id)
    setEditingPhone(candidate.phone ?? null)
    setEditingEmail(candidate.email ?? null)
    setFullName(candidate.fullName)
    setConsultancyName(candidate.consultancyName || candidate.employerLabel || '')
    setWhatsappGroupName(candidate.whatsappGroupName || '')
    setWhatsappGroupLink(candidate.whatsappGroupLink || '')
    setSelectedSkillIds(candidate.skillIds ?? [])
    setTechQuery('')
    setMsg(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = useMutation({
    mutationFn: () => {
      const body = {
        fullName,
        consultancyName: editingId ? consultancyName : (consultancyName || undefined),
        whatsappGroupName,
        whatsappGroupLink: editingId ? whatsappGroupLink : (whatsappGroupLink || undefined),
        skillIds: selectedSkillIds,
        primarySkillId: selectedSkillIds[0],
        phone: editingPhone || undefined,
        email: editingEmail || undefined,
      }
      return editingId
        ? api<Candidate>(`/api/v1/candidates/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
        : api<Candidate>('/api/v1/candidates', { method: 'POST', body: JSON.stringify(body) })
    },
    onSuccess: () => {
      const wasEdit = Boolean(editingId)
      resetForm()
      setMsg(wasEdit ? 'Candidate details updated.' : 'Candidate added as Not started. Activate support when ready.')
      qc.invalidateQueries({ queryKey: ['candidates'] })
    },
    onError: (e: Error) => setMsg(e.message),
  })

  const skillOptions = (skills.data ?? []).filter((s) => {
    if (selectedSkillIds.includes(s.id)) return false
    if (!techQuery.trim()) return true
    return s.name.toLowerCase().includes(techQuery.toLowerCase())
  })
  const selectedSkills = (skills.data ?? []).filter((s) => selectedSkillIds.includes(s.id))
  const items = query.data?.items ?? []
  const total = query.data?.totalElements ?? items.length

  const statusLabel = (value: string) =>
    value.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidates"
        subtitle="Manage candidate details, technologies and support groups."
        actions={
          <button
            className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Add candidate
          </button>
        }
      />

      {showForm ? (
        <form
          className="dsms-card p-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            save.mutate()
          }}
        >
          <h3 className="font-semibold text-lg">{editingId ? 'Edit candidate' : 'Add candidate'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">
              Full name <span className="text-rose-500">*</span>
              <input
                className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Consultancy name <span className="text-muted font-normal">(Optional)</span>
              <input
                className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm"
                placeholder="Enter consultancy name"
                value={consultancyName}
                onChange={(e) => setConsultancyName(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              WhatsApp group name <span className="text-rose-500">*</span>
              <input
                className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm"
                placeholder="e.g. Arjun • Java Support"
                value={whatsappGroupName}
                onChange={(e) => setWhatsappGroupName(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              WhatsApp group link <span className="text-muted font-normal">(Optional)</span>
              <div className="mt-1.5 relative">
                <Link2 className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full border border-line rounded-xl pl-10 pr-3 py-2.5 text-sm"
                  placeholder="https://chat.whatsapp.com/..."
                  value={whatsappGroupLink}
                  onChange={(e) => setWhatsappGroupLink(e.target.value)}
                />
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Tech stack</label>
            <div className="border border-line rounded-xl p-3 space-y-2">
              {selectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((s) => (
                    <span key={s.id} className="dsms-chip bg-brand-soft text-brand-dark inline-flex items-center gap-1">
                      {s.name}
                      <button type="button" onClick={() => setSelectedSkillIds((ids) => ids.filter((id) => id !== s.id))}>
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="relative">
                <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full border border-line rounded-lg pl-10 pr-3 py-2 text-sm"
                  placeholder="Search and select technologies..."
                  value={techQuery}
                  onChange={(e) => setTechQuery(e.target.value)}
                />
              </div>
              {techQuery || selectedSkillIds.length === 0 ? (
                <div className="max-h-36 overflow-y-auto flex flex-wrap gap-2">
                  {skillOptions.slice(0, 12).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="dsms-chip bg-slate-100 text-slate-700 hover:bg-brand-soft hover:text-brand-dark"
                      onClick={() => {
                        setSelectedSkillIds((ids) => [...ids, s.id])
                        setTechQuery('')
                      }}
                    >
                      + {s.name}
                    </button>
                  ))}
                </div>
              ) : null}
              <p className="text-xs text-muted">
                Select multiple technologies for this candidate.
                {selectedSkillIds.length > 0 ? ` ${selectedSkillIds.length} selected.` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-sm text-muted inline-flex items-center gap-2">
              <Info className="size-4 text-brand" />
              {editingId
                ? 'Changes apply immediately to candidate records and activation.'
                : 'Support can be activated after the candidate is added.'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark disabled:opacity-60"
                disabled={save.isPending}
              >
                {save.isPending ? 'Saving…' : editingId ? 'Save changes' : '+ Add candidate'}
              </button>
            </div>
          </div>
          {msg ? <p className="text-sm text-slate-700 break-words">{msg}</p> : null}
        </form>
      ) : null}

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h2 className="font-semibold">All candidates</h2>
            <p className="text-xs text-muted mt-0.5">{total} candidate{total === 1 ? '' : 's'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-56"
                placeholder="Search name or group..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="rounded-xl border border-line px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              {['NOT_STARTED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'INACTIVE'].map((s) => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                {['Candidate', 'Consultancy', 'WhatsApp group', 'Tech stack', 'Supporter', 'Start date', 'Status', 'This month', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td className="px-5 py-8 text-muted" colSpan={9}>No candidates yet.</td></tr>
              ) : items.map((r) => {
                const tech = r.technologies?.length ? r.technologies : (r.technology ? [r.technology] : [])
                return (
                  <tr key={r.id} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <Link to={`/candidates/${r.id}`} className="inline-flex items-center gap-3 hover:text-brand">
                        <span className={cn('size-9 rounded-full grid place-items-center text-xs font-bold', avatarTone(r.fullName))}>
                          {r.fullName.slice(0, 1)}
                        </span>
                        <span className="font-semibold">{r.fullName}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{r.consultancyName || r.employerLabel || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-2">
                        <span>{r.whatsappGroupName || '—'}</span>
                        {r.whatsappGroupLink ? (
                          <>
                            <a
                              href={r.whatsappGroupLink}
                              target="_blank"
                              rel="noreferrer"
                              className="size-7 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center"
                              title="Open WhatsApp group"
                            >
                              <span className="text-[10px] font-bold">WA</span>
                            </a>
                            <a
                              href={r.whatsappGroupLink}
                              target="_blank"
                              rel="noreferrer"
                              className="size-7 rounded-lg bg-slate-100 text-slate-600 grid place-items-center"
                              title="Open link"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          </>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {tech.length === 0 ? <span className="text-muted">—</span> : tech.map((t) => (
                          <span key={t} className="dsms-chip bg-sky-100 text-sky-800">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{r.primarySupporterName || '—'}</td>
                    <td className="px-5 py-3.5 text-muted">
                      {r.supportStartDate ? formatShortDate(r.supportStartDate) : '—'}
                    </td>
                    <td className="px-5 py-3.5"><StatusChip status={r.status} /></td>
                    <td className="px-5 py-3.5 font-semibold">{r.thisMonthHours || '0h 00m'}</td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1"
                        onClick={() => startEdit(r)}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <footer className="px-5 py-3 border-t border-line flex items-center justify-between text-sm text-muted">
          <span>Showing {items.length} of {total} candidates</span>
          <Link to="/assignments" className="font-semibold text-brand hover:underline">Activate support →</Link>
        </footer>
      </section>
    </div>
  )
}

export function ExpertsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [workingTime, setWorkingTime] = useState<'MORNING' | 'EVENING' | 'BOTH'>('BOTH')
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [techQuery, setTechQuery] = useState('')
  const [rate, setRate] = useState('600')
  const [paymentType, setPaymentType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY')
  const [listQ, setListQ] = useState('')
  const [workingFilter, setWorkingFilter] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const skills = useQuery({ queryKey: ['skills'], queryFn: () => api<Skill[]>('/api/v1/skills') })
  const query = useQuery({
    queryKey: ['experts', listQ, workingFilter],
    queryFn: () =>
      api<PageResponse<Expert>>(
        `/api/v1/experts?q=${encodeURIComponent(listQ)}&workingTime=${encodeURIComponent(workingFilter)}&size=100`,
      ),
  })

  const resetForm = () => {
    setEditingId(null)
    setFullName('')
    setPhone('')
    setWorkingTime('BOTH')
    setSelectedSkillIds([])
    setTechQuery('')
    setRate('600')
    setPaymentType('HOURLY')
    setMsg(null)
  }

  const startEdit = (expert: Expert) => {
    setShowForm(true)
    setEditingId(expert.id)
    setFullName(expert.fullName)
    setPhone(expert.phone ?? '')
    setWorkingTime((expert.workingTime as 'MORNING' | 'EVENING' | 'BOTH') || 'BOTH')
    setSelectedSkillIds((expert.skills ?? []).map((s) => s.skillId))
    setRate(expert.hourlyPayoutRate ? String(Number(expert.hourlyPayoutRate)) : '600')
    setPaymentType(expert.paymentType === 'MONTHLY' ? 'MONTHLY' : 'HOURLY')
    setMsg(null)
    setMenuOpen(null)
  }

  const save = useMutation({
    mutationFn: () => {
      const body = {
        fullName,
        phone: phone.trim(),
        workingTime,
        skillIds: selectedSkillIds,
        hourlyPayoutRate: String(Number(rate.replace(/,/g, '')) || 0),
        paymentType,
        status: 'ACTIVE',
      }
      return editingId
        ? api<Expert>(`/api/v1/experts/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
        : api<Expert>('/api/v1/experts', { method: 'POST', body: JSON.stringify(body) })
    },
    onSuccess: () => {
      const wasEdit = Boolean(editingId)
      resetForm()
      setMsg(wasEdit ? 'Supporter updated.' : 'Supporter added. Assign candidates from Activation when ready.')
      qc.invalidateQueries({ queryKey: ['experts'] })
    },
    onError: (e: Error) => setMsg(e.message),
  })

  const skillOptions = (skills.data ?? []).filter((s) => {
    if (selectedSkillIds.includes(s.id)) return false
    if (!techQuery.trim()) return true
    return s.name.toLowerCase().includes(techQuery.toLowerCase())
  })
  const selectedSkills = (skills.data ?? []).filter((s) => selectedSkillIds.includes(s.id))
  const items = query.data?.items ?? []
  const total = query.data?.totalElements ?? items.length

  const formatRate = (value: string | null | undefined, plan: string | null | undefined) => {
    if (!value) return '—'
    const n = Number(value)
    const suffix = plan === 'MONTHLY' ? '/ mo' : '/ hr'
    return `₹${(Number.isFinite(n) ? n : 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ${suffix}`
  }

  const workingTone = (value: string | null | undefined) => {
    if (value === 'MORNING') return 'bg-orange-100 text-orange-800'
    if (value === 'EVENING') return 'bg-violet-100 text-violet-800'
    return 'bg-teal-100 text-teal-800'
  }

  const workingLabel = (value: string | null | undefined) => {
    if (value === 'MORNING') return 'Morning'
    if (value === 'EVENING') return 'Evening'
    return 'Both'
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Supporters"
        subtitle="Manage expertise, availability and support rates."
        actions={
          <button
            className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Add supporter
          </button>
        }
      />

      {showForm ? (
        <form
          className="dsms-card p-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            save.mutate()
          }}
        >
          <h3 className="font-semibold text-lg">{editingId ? 'Edit supporter' : 'Add supporter'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">
              Full name <span className="text-rose-500">*</span>
              <div className="mt-1.5 relative">
                <User className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full border border-line rounded-xl pl-10 pr-3 py-2.5 text-sm"
                  placeholder="Vikram Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="block text-sm font-medium">
              Phone number <span className="text-rose-500">*</span>
              <div className="mt-1.5 relative">
                <Phone className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full border border-line rounded-xl pl-10 pr-3 py-2.5 text-sm"
                  placeholder="9876543210"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </label>

            <div className="md:col-span-2">
              <p className="text-sm font-medium mb-1.5">Working time <span className="text-rose-500">*</span></p>
              <div className="grid sm:grid-cols-3 gap-2">
                {([
                  ['MORNING', 'Morning', Sun],
                  ['EVENING', 'Evening', Moon],
                  ['BOTH', 'Both', Sun],
                ] as const).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      'rounded-xl border px-3 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2 transition',
                      workingTime === key
                        ? 'border-brand bg-brand-soft text-brand-dark'
                        : 'border-line bg-white text-slate-600 hover:bg-slate-50',
                    )}
                    onClick={() => setWorkingTime(key)}
                  >
                    {key === 'BOTH' ? (
                      <span className="inline-flex items-center gap-0.5">
                        <Sun className="size-4" />
                        <Moon className="size-3.5" />
                      </span>
                    ) : (
                      <Icon className="size-4" />
                    )}
                    {label}
                    {workingTime === key ? <Check className="size-3.5" /> : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Tech stack</label>
              <div className="border border-line rounded-xl p-3 space-y-2">
                {selectedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((s) => (
                      <span key={s.id} className="dsms-chip bg-brand-soft text-brand-dark inline-flex items-center gap-1">
                        {s.name}
                        <button type="button" onClick={() => setSelectedSkillIds((ids) => ids.filter((id) => id !== s.id))}>
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="relative">
                  <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full border border-line rounded-lg pl-10 pr-3 py-2 text-sm"
                    placeholder="Search and select technologies..."
                    value={techQuery}
                    onChange={(e) => setTechQuery(e.target.value)}
                  />
                </div>
                {techQuery || selectedSkillIds.length === 0 ? (
                  <div className="max-h-36 overflow-y-auto flex flex-wrap gap-2">
                    {skillOptions.slice(0, 12).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="dsms-chip bg-slate-100 text-slate-700 hover:bg-brand-soft hover:text-brand-dark"
                        onClick={() => {
                          setSelectedSkillIds((ids) => [...ids, s.id])
                          setTechQuery('')
                        }}
                      >
                        + {s.name}
                      </button>
                    ))}
                  </div>
                ) : null}
                <p className="text-xs text-muted">
                  {selectedSkillIds.length > 0 ? `${selectedSkillIds.length} selected.` : 'Select technologies this supporter covers.'}
                </p>
              </div>
            </div>

            <label className="block text-sm font-medium md:col-span-2 sm:max-w-md">
              Rate <span className="text-rose-500">*</span>
              <div className="mt-1.5 flex rounded-xl border border-line overflow-hidden">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                  <input
                    className="w-full pl-8 pr-3 py-2.5 text-sm outline-none"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    required
                  />
                </div>
                <select
                  className="border-l border-line bg-slate-50 px-3 py-2.5 text-sm font-medium"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as 'HOURLY' | 'MONTHLY')}
                >
                  <option value="HOURLY">Per hour</option>
                  <option value="MONTHLY">Per month</option>
                </select>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-sm text-muted inline-flex items-center gap-2">
              <Info className="size-4 text-brand" />
              Assign candidates after adding the supporter.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark disabled:opacity-60"
                disabled={save.isPending}
              >
                {save.isPending ? 'Saving…' : editingId ? 'Save changes' : '+ Add supporter'}
              </button>
            </div>
          </div>
          {msg ? <p className="text-sm text-slate-700 break-words">{msg}</p> : null}
        </form>
      ) : null}

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h2 className="font-semibold">All supporters</h2>
            <p className="text-xs text-muted mt-0.5">{total} supporter{total === 1 ? '' : 's'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-56"
                placeholder="Search name or technology..."
                value={listQ}
                onChange={(e) => setListQ(e.target.value)}
              />
            </div>
            <select
              className="rounded-xl border border-line px-3 py-2 text-sm"
              value={workingFilter}
              onChange={(e) => setWorkingFilter(e.target.value)}
            >
              <option value="">All working times</option>
              <option value="MORNING">Morning</option>
              <option value="EVENING">Evening</option>
              <option value="BOTH">Both</option>
            </select>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                {['Supporter', 'Tech stack', 'Working time', 'Rate', 'Active candidates', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td className="px-5 py-8 text-muted" colSpan={6}>No supporters yet.</td></tr>
              ) : items.map((r) => {
                const tech = r.technologies?.length
                  ? r.technologies
                  : r.primaryTechnology
                    ? [r.primaryTechnology]
                    : []
                return (
                  <tr key={r.id} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <Link to={`/experts/${r.id}`} className="inline-flex items-center gap-3 hover:text-brand">
                        <span className={cn('size-9 rounded-full grid place-items-center text-xs font-bold', avatarTone(r.fullName))}>
                          {r.fullName.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()}
                        </span>
                        <span>
                          <span className="font-semibold block">{r.fullName}</span>
                          {r.phone ? <span className="text-xs text-muted">{r.phone}</span> : null}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {tech.length === 0 ? <span className="text-muted">—</span> : tech.map((t) => (
                          <span key={t} className="dsms-chip bg-sky-100 text-sky-800">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('dsms-chip inline-flex items-center gap-1', workingTone(r.workingTime))}>
                        {r.workingTime === 'MORNING' ? <Sun className="size-3" /> : null}
                        {r.workingTime === 'EVENING' ? <Moon className="size-3" /> : null}
                        {r.workingTime === 'BOTH' || !r.workingTime ? (
                          <>
                            <Sun className="size-3" />
                            <Moon className="size-3" />
                          </>
                        ) : null}
                        {workingLabel(r.workingTime)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold">{formatRate(r.hourlyPayoutRate, r.paymentType)}</td>
                    <td className="px-5 py-3.5 font-semibold">{r.activeCandidateCount ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="relative inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1"
                          onClick={() => startEdit(r)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-line size-8 grid place-items-center hover:bg-slate-50"
                          onClick={() => setMenuOpen((id) => (id === r.id ? null : r.id))}
                        >
                          <MoreVertical className="size-4" />
                        </button>
                        {menuOpen === r.id ? (
                          <div className="absolute right-0 top-9 z-10 min-w-36 rounded-xl border border-line bg-white shadow-lg py-1">
                            <Link
                              to={`/experts/${r.id}`}
                              className="block px-3 py-2 text-sm hover:bg-slate-50"
                              onClick={() => setMenuOpen(null)}
                            >
                              View profile
                            </Link>
                            <Link
                              to="/assignments"
                              className="block px-3 py-2 text-sm hover:bg-slate-50"
                              onClick={() => setMenuOpen(null)}
                            >
                              Assign candidate
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <footer className="px-5 py-3 border-t border-line flex items-center justify-between text-sm text-muted">
          <span>Showing {items.length} of {total} supporters</span>
          <Link to="/assignments" className="font-semibold text-brand hover:underline">Go to Activation →</Link>
        </footer>
      </section>
    </div>
  )
}

export function AssignmentsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const today = new Date().toISOString().slice(0, 10)
  const [candidateId, setCandidateId] = useState('')
  const [primaryExpertId, setPrimaryExpertId] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [meetingUrl, setMeetingUrl] = useState('')
  const [planType, setPlanType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY')
  const [candidateFee, setCandidateFee] = useState('1000')
  const [supporterRate, setSupporterRate] = useState('600')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'SCHEDULED' | 'PAUSED'>('ALL')
  const [listQ, setListQ] = useState('')

  const candidates = useQuery({
    queryKey: ['candidates', 'activation'],
    queryFn: () => api<PageResponse<Candidate>>('/api/v1/candidates?size=100'),
  })
  const experts = useQuery({
    queryKey: ['experts', 'activation'],
    queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=100'),
  })
  const engagements = useQuery({
    queryKey: ['engagements', listQ, tab],
    queryFn: () => {
      const status = tab === 'ALL' ? '' : tab
      return api<PageResponse<Engagement>>(
        `/api/v1/engagements?q=${encodeURIComponent(listQ)}&status=${encodeURIComponent(status)}&size=100`,
      )
    },
  })
  const counts = useQuery({
    queryKey: ['engagements', 'counts'],
    queryFn: () => api<PageResponse<Engagement>>('/api/v1/engagements?size=100'),
  })

  const activatable = (candidates.data?.items ?? []).filter((c) =>
    ['NOT_STARTED', 'ON_HOLD', 'INACTIVE'].includes(c.status),
  )
  const selectedCandidate = (candidates.data?.items ?? []).find((c) => c.id === candidateId) ?? null
  const selectedExpert = (experts.data?.items ?? []).find((e) => e.id === primaryExpertId) ?? null
  const feeNum = Number(candidateFee.replace(/,/g, '')) || 0
  const rateNum = Number(supporterRate.replace(/,/g, '')) || 0
  const margin = feeNum - rateNum
  const unit = planType === 'HOURLY' ? '/ hr' : '/ mo'
  const statusAfter = startDate > today ? 'SCHEDULED' : 'ACTIVE'
  const ready = Boolean(candidateId && primaryExpertId && candidateFee && supporterRate && startDate)

  const resetForm = () => {
    setCandidateId('')
    setPrimaryExpertId('')
    setStartDate(today)
    setMeetingUrl('')
    setPlanType('HOURLY')
    setCandidateFee('1000')
    setSupporterRate('600')
    setNotes('')
    setMessage(null)
  }

  const activate = useMutation({
    mutationFn: () =>
      api<Engagement>('/api/v1/engagements/activate-support', {
        method: 'POST',
        body: JSON.stringify({
          candidateId,
          primaryExpertId,
          startDate,
          meetingUrl: meetingUrl || undefined,
          meetingPlatform: meetingUrl?.includes('zoom') ? 'ZOOM' : meetingUrl ? 'GOOGLE_MEET' : 'OTHER',
          candidateFee: String(feeNum),
          supporterRate: String(rateNum),
          planType,
          notes: notes || undefined,
          title: selectedCandidate ? `${selectedCandidate.fullName} support` : undefined,
        }),
      }),
    onSuccess: (data) => {
      resetForm()
      setMessage(
        data.status === 'SCHEDULED'
          ? 'Support scheduled. It will become active on the start date (or resume it earlier).'
          : 'Support activated. Candidate is now ACTIVE on the Daily Sheet.',
      )
      qc.invalidateQueries({ queryKey: ['candidates'] })
      qc.invalidateQueries({ queryKey: ['engagements'] })
      qc.invalidateQueries({ queryKey: ['experts'] })
      qc.invalidateQueries({ queryKey: ['daily-sheet'] })
    },
    onError: (e: Error) => setMessage(e.message),
  })

  const resume = useMutation({
    mutationFn: (id: string) =>
      api(`/api/v1/engagements/${id}/resume`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Resumed from Activation' }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engagements'] })
      qc.invalidateQueries({ queryKey: ['candidates'] })
      qc.invalidateQueries({ queryKey: ['daily-sheet'] })
    },
    onError: (e: Error) => setMessage(e.message),
  })

  const pause = useMutation({
    mutationFn: (id: string) =>
      api(`/api/v1/engagements/${id}/pause`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Paused from Activation' }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engagements'] })
      qc.invalidateQueries({ queryKey: ['daily-sheet'] })
    },
    onError: (e: Error) => setMessage(e.message),
  })

  const allItems = counts.data?.items ?? []
  const tabCounts = {
    ALL: allItems.length,
    ACTIVE: allItems.filter((e) => e.status === 'ACTIVE').length,
    SCHEDULED: allItems.filter((e) => e.status === 'SCHEDULED').length,
    PAUSED: allItems.filter((e) => e.status === 'PAUSED').length,
  }
  const items = engagements.data?.items ?? []
  const tech = selectedCandidate
    ? selectedCandidate.technologies?.length
      ? selectedCandidate.technologies
      : selectedCandidate.technology
        ? [selectedCandidate.technology]
        : []
    : []

  const formatInr = (n: number) =>
    `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  const formatFeeLabel = (fee: string | null | undefined, plan: string | null | undefined) => {
    if (!fee) return '—'
    const n = Number(fee)
    const suffix = plan === 'MONTHLY' ? '/ mo' : '/ hr'
    return `${formatInr(Number.isFinite(n) ? n : 0)} ${suffix}`
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Support activation"
        subtitle="Assign a supporter, set pricing and start support."
        actions={
          <button
            type="button"
            className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={() => navigate('/daily-sheet')}
          >
            View daily sheet
          </button>
        }
      />

      <div className="grid xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.85fr)] gap-5">
        <form
          className="dsms-card p-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            activate.mutate()
          }}
        >
          <h3 className="font-semibold text-lg">New activation</h3>

          <label className="block text-sm font-medium">
            Candidate <span className="text-rose-500">*</span>
            <select
              className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              required
            >
              <option value="">Select candidate</option>
              {activatable.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
            {selectedCandidate ? (
              <span className="mt-2 inline-flex">
                <StatusChip status={selectedCandidate.status} />
              </span>
            ) : null}
          </label>

          <label className="block text-sm font-medium">
            Primary supporter <span className="text-rose-500">*</span>
            <select
              className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm"
              value={primaryExpertId}
              onChange={(e) => {
                const id = e.target.value
                setPrimaryExpertId(id)
                const expert = (experts.data?.items ?? []).find((x) => x.id === id)
                if (expert?.hourlyPayoutRate && planType === 'HOURLY') {
                  setSupporterRate(String(Number(expert.hourlyPayoutRate)))
                }
              }}
              required
            >
              <option value="">Select supporter</option>
              {(experts.data?.items ?? [])
                .filter((e) => e.status === 'ACTIVE' || e.status === 'AVAILABLE')
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
            </select>
            {selectedExpert ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <StatusChip status={selectedExpert.status === 'ACTIVE' ? 'ACTIVE' : selectedExpert.status} />
                <span className="text-muted">
                  {selectedExpert.activeCandidateCount ?? 0} active candidate
                  {(selectedExpert.activeCandidateCount ?? 0) === 1 ? '' : 's'}
                </span>
              </div>
            ) : null}
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">
              Start date <span className="text-rose-500">*</span>
              <input
                type="date"
                className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Meeting link <span className="text-muted font-normal">(Optional)</span>
              <div className="mt-1.5 relative">
                <Link2 className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full border border-line rounded-xl pl-10 pr-3 py-2.5 text-sm"
                  placeholder="Google Meet or Zoom URL"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                />
              </div>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-medium">Billing plan</p>
              <span className="text-xs text-muted">Currency: INR</span>
            </div>
            <div className="inline-flex rounded-xl border border-line p-1 bg-slate-50">
              {(['HOURLY', 'MONTHLY'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={cn(
                    'rounded-lg px-4 py-1.5 text-sm font-semibold transition',
                    planType === p ? 'bg-white text-brand shadow-sm' : 'text-muted hover:text-ink',
                  )}
                  onClick={() => setPlanType(p)}
                >
                  {p === 'HOURLY' ? 'Hourly' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">
              Candidate fee <span className="text-rose-500">*</span>
              <div className="mt-1.5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                <input
                  className="w-full border border-line rounded-xl pl-8 pr-16 py-2.5 text-sm"
                  value={candidateFee}
                  onChange={(e) => setCandidateFee(e.target.value)}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit.trim()}</span>
              </div>
            </label>
            <label className="block text-sm font-medium">
              Supporter rate <span className="text-rose-500">*</span>
              <div className="mt-1.5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                <input
                  className="w-full border border-line rounded-xl pl-8 pr-16 py-2.5 text-sm"
                  value={supporterRate}
                  onChange={(e) => setSupporterRate(e.target.value)}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit.trim()}</span>
              </div>
            </label>
          </div>

          <label className="block text-sm font-medium">
            Support notes <span className="text-muted font-normal">(Optional)</span>
            <textarea
              className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm min-h-24"
              placeholder="Handover details or support requirements"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-sm text-muted inline-flex items-center gap-2">
              <Info className="size-4 text-brand" />
              {startDate > today
                ? 'A future start date schedules activation.'
                : 'Activating today starts support immediately.'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 inline-flex items-center gap-2"
                disabled={activate.isPending || !ready}
              >
                <Power className="size-4" />
                {activate.isPending ? 'Activating…' : 'Activate support'}
              </button>
            </div>
          </div>
          {message ? <p className="text-sm text-slate-700 break-words">{message}</p> : null}
        </form>

        <aside className="space-y-4">
          <section className="dsms-card p-5 space-y-3">
            <h3 className="font-semibold">Candidate overview</h3>
            {selectedCandidate ? (
              <>
                <div className="flex items-center gap-3">
                  <span className={cn('size-11 rounded-full grid place-items-center text-sm font-bold', avatarTone(selectedCandidate.fullName))}>
                    {selectedCandidate.fullName.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-semibold">{selectedCandidate.fullName}</p>
                    <p className="text-xs text-muted">{selectedCandidate.consultancyName || selectedCandidate.employerLabel || '—'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.length === 0 ? <span className="text-sm text-muted">No tech stack</span> : tech.map((t) => (
                    <span key={t} className="dsms-chip bg-sky-100 text-sky-800">{t}</span>
                  ))}
                </div>
                {selectedCandidate.whatsappGroupName ? (
                  <div className="rounded-xl bg-emerald-50 text-emerald-800 px-3 py-2 text-sm flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{selectedCandidate.whatsappGroupName}</span>
                    {selectedCandidate.whatsappGroupLink ? (
                      <a href={selectedCandidate.whatsappGroupLink} target="_blank" rel="noreferrer" className="shrink-0">
                        <ExternalLink className="size-4" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted">Select a candidate to preview details.</p>
            )}
          </section>

          <section className="dsms-card p-5 space-y-3">
            <h3 className="font-semibold">Activation summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Starts on</dt>
                <dd className="font-semibold">{startDate ? formatShortDate(startDate) + ' ' + new Date(`${startDate}T00:00:00`).getFullYear() : '—'}</dd>
              </div>
              <div className="flex justify-between gap-3 items-center">
                <dt className="text-muted">Status after activation</dt>
                <dd><StatusChip status={statusAfter} /></dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Billing plan</dt>
                <dd className="font-semibold">{planType === 'HOURLY' ? 'Hourly' : 'Monthly'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Candidate fee</dt>
                <dd className="font-semibold">{formatInr(feeNum)} {unit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Supporter rate</dt>
                <dd className="font-semibold">{formatInr(rateNum)} {unit}</dd>
              </div>
            </dl>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-3">
              <p className="text-xs text-emerald-700 font-medium">Rate difference</p>
              <p className="text-lg font-extrabold text-emerald-800 mt-0.5">
                {formatInr(margin)} {unit}
              </p>
            </div>
            <div className={cn('rounded-xl px-3 py-2.5 text-sm inline-flex items-center gap-2 w-full', ready ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-muted')}>
              <CheckCircle2 className="size-4" />
              {ready ? 'Ready to activate' : 'Complete required fields'}
            </div>
          </section>
        </aside>
      </div>

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Support engagements</h2>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-56"
                  placeholder="Search candidate or group..."
                  value={listQ}
                  onChange={(e) => setListQ(e.target.value)}
                />
              </div>
              <button type="button" className="rounded-xl border border-line size-9 grid place-items-center text-muted" title="Filters">
                <Filter className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['ALL', 'All'],
              ['ACTIVE', 'Active'],
              ['SCHEDULED', 'Scheduled'],
              ['PAUSED', 'Paused'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold border',
                  tab === key ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-line hover:bg-slate-50',
                )}
                onClick={() => setTab(key)}
              >
                {label} ({tabCounts[key]})
              </button>
            ))}
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                {['Candidate / Group', 'Supporter', 'Plan / Fee', 'Start date', 'Status', 'This month', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td className="px-5 py-8 text-muted" colSpan={7}>No engagements yet.</td></tr>
              ) : items.map((row) => (
                <tr key={row.id} className="border-t border-line hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold">{row.candidateName || row.title}</div>
                    <div className="text-xs text-muted">{row.groupName || row.displayCode}</div>
                  </td>
                  <td className="px-5 py-3.5">{row.primaryExpertName || '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold">{formatFeeLabel(row.candidateFee, row.planType)}</div>
                    <div className="text-xs text-muted">{row.planType === 'MONTHLY' ? 'Monthly' : 'Hourly'}</div>
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {row.startDate ? `${formatShortDate(row.startDate)} ${new Date(`${row.startDate}T00:00:00`).getFullYear()}` : '—'}
                  </td>
                  <td className="px-5 py-3.5"><StatusChip status={row.status} /></td>
                  <td className="px-5 py-3.5 font-semibold">{row.thisMonthHours || '0h 00m'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-2">
                      {row.status === 'ACTIVE' && row.defaultMeetingUrl ? (
                        <a
                          href={row.defaultMeetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-brand text-white px-3 py-1.5 text-xs font-semibold hover:bg-brand-dark"
                        >
                          Join
                        </a>
                      ) : null}
                      {row.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                          onClick={() => pause.mutate(row.id)}
                          disabled={pause.isPending}
                        >
                          Pause
                        </button>
                      ) : null}
                      {row.status === 'PAUSED' || row.status === 'SCHEDULED' ? (
                        <button
                          type="button"
                          className="rounded-lg bg-brand text-white px-3 py-1.5 text-xs font-semibold hover:bg-brand-dark"
                          onClick={() => resume.mutate(row.id)}
                          disabled={resume.isPending}
                        >
                          {row.status === 'SCHEDULED' ? 'Start' : 'Resume'}
                        </button>
                      ) : null}
                      {row.status !== 'ACTIVE' ? (
                        <Link
                          to={`/candidates/${row.candidateId}`}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                        >
                          View
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export function DailySheetPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [q, setQ] = useState('')
  const [techFilter, setTechFilter] = useState('')
  const [supporterFilter, setSupporterFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tab, setTab] = useState<'ALL' | 'RUNNING' | 'PENDING' | 'SUPPORTED' | 'MISSED'>('ALL')
  const [selected, setSelected] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [showLog, setShowLog] = useState(false)
  const [logEngagementId, setLogEngagementId] = useState('')
  const [dailyNote, setDailyNote] = useState(() => localStorage.getItem(`dsms-daily-note-${today}`) ?? '')
  const [noteMsg, setNoteMsg] = useState<string | null>(null)
  const qc = useQueryClient()

  const sheet = useQuery({
    queryKey: ['daily-sheet', date],
    queryFn: () => api<DailySheet>(`/api/v1/daily-sheet?date=${date}`),
    refetchInterval: 5000,
  })
  const skills = useQuery({ queryKey: ['skills'], queryFn: () => api<Skill[]>('/api/v1/skills') })
  const experts = useQuery({
    queryKey: ['experts', 'daily-sheet'],
    queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=100'),
  })

  const shift = (days: number) => {
    const d = new Date(`${date}T00:00:00`)
    d.setDate(d.getDate() + days)
    const next = d.toISOString().slice(0, 10)
    setDate(next)
    setDailyNote(localStorage.getItem(`dsms-daily-note-${next}`) ?? '')
    setSelected([])
  }

  const start = useMutation({
    mutationFn: (engagementId: string) => api('/api/v1/work-entries/start', {
      method: 'POST',
      body: JSON.stringify({ engagementId, category: 'MEETING' }),
      headers: { 'Idempotency-Key': crypto.randomUUID() },
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['daily-sheet'] }); qc.invalidateQueries({ queryKey: ['active-timer'] }) },
  })
  const stop = useMutation({
    mutationFn: (workEntryId: string) => api(`/api/v1/work-entries/${workEntryId}/stop`, {
      method: 'POST',
      body: JSON.stringify({ workDone: 'Support completed from Daily Sheet', issueTopic: 'Daily support', remarks: '' }),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['daily-sheet'] }); qc.invalidateQueries({ queryKey: ['active-timer'] }) },
  })
  const mark = useMutation({
    mutationFn: ({ candidateId, dayStatus, notes }: { candidateId: string; dayStatus: string; notes?: string }) =>
      api(`/api/v1/daily-sheet/${candidateId}?date=${date}`, {
        method: 'PUT',
        body: JSON.stringify({ dayStatus, notes: notes ?? undefined }),
      }),
    onSuccess: () => {
      setMenuOpen(null)
      qc.invalidateQueries({ queryKey: ['daily-sheet'] })
    },
  })

  const s = sheet.data?.summary
  const allRows = sheet.data?.rows ?? []
  const technologies = Array.from(new Set(allRows.map((r) => r.technology).filter(Boolean) as string[])).sort()
  const unassignedRows = allRows.filter((r) => !r.supporterId)
  const unassigned = unassignedRows.length
  const missedCount = s?.missed ?? allRows.filter((r) => r.dayStatus === 'MISSED').length
  const anySessionLogged = allRows.some((r) => Boolean(r.start || r.end || (r.duration && r.duration !== '0h 00m')))

  const filtered = allRows.filter((r) => {
    if (tab === 'RUNNING' && r.dayStatus !== 'RUNNING') return false
    if (tab === 'PENDING' && r.dayStatus !== 'PENDING') return false
    if (tab === 'SUPPORTED' && r.dayStatus !== 'COMPLETED') return false
    if (tab === 'MISSED' && r.dayStatus !== 'MISSED') return false
    if (statusFilter && r.dayStatus !== statusFilter) return false
    if (techFilter && (r.technology ?? '') !== techFilter) return false
    if (supporterFilter === '__UNASSIGNED__' && r.supporterId) return false
    if (supporterFilter && supporterFilter !== '__UNASSIGNED__' && r.supporterId !== supporterFilter) return false
    if (!q.trim()) return true
    const needle = q.toLowerCase()
    return r.candidateName.toLowerCase().includes(needle)
      || (r.groupName ?? '').toLowerCase().includes(needle)
      || (r.supporterName ?? '').toLowerCase().includes(needle)
      || (r.technology ?? '').toLowerCase().includes(needle)
  })

  const tabCounts = {
    ALL: allRows.length,
    RUNNING: allRows.filter((r) => r.dayStatus === 'RUNNING').length,
    PENDING: allRows.filter((r) => r.dayStatus === 'PENDING').length,
    SUPPORTED: allRows.filter((r) => r.dayStatus === 'COMPLETED').length,
    MISSED: allRows.filter((r) => r.dayStatus === 'MISSED').length,
  }

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? filtered.map((r) => r.candidateId) : [])
  }

  const exportCsv = () => {
    const header = ['Candidate', 'Group', 'Technology', 'Supporter', 'Start', 'End', 'Duration', 'Status']
    const lines = filtered.map((r) => [
      r.candidateName,
      r.groupName ?? '',
      r.technology ?? '',
      r.supporterName ?? '',
      r.start ?? '',
      r.end ?? '',
      r.duration,
      r.dayStatus,
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-sheet-${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatClock = (value: string | null) => {
    if (!value) return null
    return value.slice(0, 5)
  }

  const statusTone = (status: string) => {
    if (status === 'MISSED') return 'bg-rose-50 text-rose-700 border border-rose-100'
    if (status === 'RUNNING') return 'bg-violet-50 text-violet-700 border border-violet-100'
    if (status === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    if (status === 'PENDING') return 'bg-orange-50 text-orange-700 border border-orange-100'
    return 'bg-slate-100 text-slate-700 border border-slate-200'
  }

  const statusLabel = (status: string) => {
    if (status === 'COMPLETED') return 'Supported'
    return status.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }

  const openLog = (engagementId?: string | null) => {
    setLogEngagementId(engagementId ?? '')
    setShowLog(true)
  }

  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const tabMeta: Record<typeof tab, { active: string; badge: string }> = {
    ALL: { active: 'bg-brand text-white border-brand', badge: 'bg-white/20 text-white' },
    RUNNING: { active: 'bg-violet-600 text-white border-violet-600', badge: 'bg-white/20 text-white' },
    PENDING: { active: 'bg-orange-500 text-white border-orange-500', badge: 'bg-white/20 text-white' },
    SUPPORTED: { active: 'bg-sky-600 text-white border-sky-600', badge: 'bg-white/20 text-white' },
    MISSED: { active: 'bg-rose-600 text-white border-rose-600', badge: 'bg-white/20 text-white' },
  }

  return (
    <div className="space-y-5 pb-2">
      <PageHeader
        title="Daily Support Sheet"
        subtitle="Track daily sessions, assignments and support hours."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2"
              onClick={exportCsv}
            >
              <Download className="size-4" />
              Export
              <ChevronDown className="size-3.5 opacity-70" />
            </button>
            <button
              type="button"
              className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark inline-flex items-center gap-2"
              onClick={() => openLog()}
            >
              <span className="text-base leading-none">+</span>
              Log session
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="rounded-xl border border-line bg-white size-9 grid place-items-center hover:bg-slate-50" onClick={() => shift(-1)}>
            <ChevronLeft className="size-4" />
          </button>
          <label className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
            <CalendarDays className="size-4 text-brand" />
            <span>{dateLabel}</span>
            <input
              type="date"
              className="sr-only"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setDailyNote(localStorage.getItem(`dsms-daily-note-${e.target.value}`) ?? '')
                setSelected([])
              }}
            />
          </label>
          <button type="button" className="rounded-xl border border-line bg-white size-9 grid place-items-center hover:bg-slate-50" onClick={() => shift(1)}>
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={() => {
              setDate(today)
              setDailyNote(localStorage.getItem(`dsms-daily-note-${today}`) ?? '')
            }}
          >
            Today
          </button>
          <span className="text-xs text-muted inline-flex items-center gap-1.5 ml-1">
            Timezone: IST
            <Info className="size-3.5" />
          </span>
        </div>

        {missedCount > 0 ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm text-rose-700 inline-flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span className="font-medium">{missedCount} missed session{missedCount === 1 ? '' : 's'} need review</span>
            <button type="button" className="font-semibold hover:underline whitespace-nowrap" onClick={() => setTab('MISSED')}>
              Review →
            </button>
          </div>
        ) : null}
      </div>

      {s ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard title="Active candidates" value={s.active} tone="green" icon={<Users className="size-5" />} />
          <MetricCard title="Supported" value={s.supported} tone="blue" icon={<CheckCircle2 className="size-5" />} />
          <MetricCard title="Running" value={s.running} tone="violet" icon={<Play className="size-5" />} />
          <MetricCard title="Pending" value={s.pending} tone="orange" icon={<Clock3 className="size-5" />} />
          <MetricCard title="Missed" value={s.missed} tone="rose" icon={<AlertTriangle className="size-5" />} />
          <MetricCard title="Total hours" value={s.totalHours} tone="sky" icon={<Clock3 className="size-5" />} />
        </div>
      ) : null}

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-60 bg-white"
                placeholder="Search candidate or group..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={techFilter} onChange={(e) => setTechFilter(e.target.value)}>
              <option value="">All technologies</option>
              {technologies.map((t) => <option key={t} value={t}>{t}</option>)}
              {(skills.data ?? []).filter((sk) => !technologies.includes(sk.name)).slice(0, 8).map((sk) => (
                <option key={sk.id} value={sk.name}>{sk.name}</option>
              ))}
            </select>
            <select className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={supporterFilter} onChange={(e) => setSupporterFilter(e.target.value)}>
              <option value="">All supporters</option>
              <option value="__UNASSIGNED__">Unassigned</option>
              {(experts.data?.items ?? []).map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
            </select>
            <select className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {['PENDING', 'RUNNING', 'COMPLETED', 'MISSED', 'NO_SUPPORT_REQUIRED'].map((st) => (
                <option key={st} value={st}>{statusLabel(st)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['ALL', 'All', 'bg-slate-200 text-slate-700'],
              ['RUNNING', 'Running', 'bg-violet-100 text-violet-700'],
              ['PENDING', 'Pending', 'bg-orange-100 text-orange-700'],
              ['SUPPORTED', 'Supported', 'bg-sky-100 text-sky-700'],
              ['MISSED', 'Missed', 'bg-rose-100 text-rose-700'],
            ] as const).map(([key, label, idleBadge]) => {
              const active = tab === key
              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    'rounded-full pl-3 pr-1.5 py-1 text-xs font-semibold border inline-flex items-center gap-2',
                    active ? tabMeta[key].active : 'bg-white text-slate-600 border-line hover:bg-slate-50',
                  )}
                  onClick={() => setTab(key)}
                >
                  {label}
                  <span className={cn('min-w-5 h-5 px-1.5 rounded-full grid place-items-center text-[11px] font-bold', active ? tabMeta[key].badge : idleBadge)}>
                    {tabCounts[key]}
                  </span>
                </button>
              )
            })}
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.length === filtered.length}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                {['Candidate / Group', 'Technology', 'Supporter', 'Session time', 'Duration', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td className="px-5 py-8 text-muted" colSpan={8}>No candidates on this sheet.</td></tr>
              ) : filtered.map((r) => {
                const sessionLabel = r.start || r.end
                  ? [formatClock(r.start) ?? '—', formatClock(r.end) ?? '—'].join(' / ')
                  : '— / Not recorded'
                const durationLabel = r.start || r.end || (r.duration && r.duration !== '0h 00m') ? r.duration : '—'
                return (
                  <tr key={r.candidateId} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(r.candidateId)}
                        onChange={(e) => setSelected((ids) => e.target.checked ? [...ids, r.candidateId] : ids.filter((id) => id !== r.candidateId))}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <Link to={`/candidates/${r.candidateId}`} className="inline-flex items-center gap-3 hover:text-brand">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(r.candidateName))}>
                          {initials(r.candidateName)}
                        </span>
                        <span>
                          <span className="font-semibold block text-slate-800">{r.candidateName}</span>
                          <span className="text-xs text-muted">{r.groupName || 'No group'}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      {r.technology ? (
                        <span className="dsms-chip bg-sky-100 text-sky-800">{r.technology}</span>
                      ) : (
                        <span className="dsms-chip bg-slate-100 text-slate-500">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {r.supporterName ? (
                        <div className="inline-flex items-center gap-2">
                          <span className={cn('size-7 rounded-full grid place-items-center text-[10px] font-bold', avatarTone(r.supporterName))}>
                            {initials(r.supporterName)}
                          </span>
                          <span className="font-medium text-slate-700">{r.supporterName}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 text-muted">
                          <span className="size-7 rounded-full bg-slate-100 grid place-items-center">
                            <User className="size-3.5" />
                          </span>
                          <span>Unassigned</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-muted whitespace-nowrap">{sessionLabel}</td>
                    <td className="px-4 py-3.5 text-muted whitespace-nowrap">{durationLabel}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('dsms-chip inline-flex items-center gap-1.5', statusTone(r.dayStatus))}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {statusLabel(r.dayStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="relative flex flex-nowrap items-center gap-1.5">
                        {r.whatsappGroupLink ? (
                          <a
                            href={r.whatsappGroupLink}
                            target="_blank"
                            rel="noreferrer"
                            className="size-8 rounded-lg bg-[#25D366]/15 ring-1 ring-[#25D366]/40 grid place-items-center hover:bg-[#25D366]/25"
                            title="Open WhatsApp"
                          >
                            <WhatsAppIcon className="size-[18px]" />
                          </a>
                        ) : (
                          <span className="size-8 rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center" title="No WhatsApp link">
                            <WhatsAppIcon className="size-[18px] opacity-35 grayscale" />
                          </span>
                        )}
                        {meetingPlatform(r.meetingUrl) === 'ZOOM' && r.meetingUrl ? (
                          <a
                            href={r.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="size-8 rounded-lg bg-[#2D8CFF]/15 ring-1 ring-[#2D8CFF]/50 grid place-items-center hover:bg-[#2D8CFF]/25"
                            title="Join Zoom"
                          >
                            <ZoomIcon className="size-4" />
                          </a>
                        ) : (
                          <span className="size-8 rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center" title="No Zoom link">
                            <ZoomIcon className="size-4 opacity-35 grayscale" />
                          </span>
                        )}
                        {meetingPlatform(r.meetingUrl) === 'GOOGLE_MEET' && r.meetingUrl ? (
                          <a
                            href={r.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="size-8 rounded-lg bg-emerald-50 ring-1 ring-emerald-300 grid place-items-center hover:bg-emerald-100"
                            title="Join Google Meet"
                          >
                            <GoogleMeetIcon className="size-4" />
                          </a>
                        ) : (
                          <span className="size-8 rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center" title="No Google Meet link">
                            <GoogleMeetIcon className="size-4 opacity-35 grayscale" />
                          </span>
                        )}
                        {!r.supporterId ? (
                          <button
                            type="button"
                            className="rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-2.5 py-1.5 text-xs font-semibold hover:bg-amber-100 whitespace-nowrap"
                            onClick={() => navigate('/assignments')}
                          >
                            Assign supporter
                          </button>
                        ) : r.dayStatus === 'RUNNING' && r.workEntryId && (user?.role === 'EXPERT' || user?.role === 'ADMIN' || user?.role === 'COORDINATOR') ? (
                          <button
                            type="button"
                            className="rounded-lg bg-brand text-white px-2.5 py-1.5 text-xs font-semibold hover:bg-brand-dark"
                            onClick={() => stop.mutate(r.workEntryId!)}
                            disabled={stop.isPending}
                          >
                            End
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 whitespace-nowrap"
                            onClick={() => {
                              if (user?.role === 'EXPERT' && r.engagementId) start.mutate(r.engagementId)
                              else openLog(r.engagementId)
                            }}
                            disabled={!r.engagementId && user?.role === 'EXPERT'}
                          >
                            Log time
                          </button>
                        )}
                        <button
                          type="button"
                          className="size-8 rounded-lg border border-line grid place-items-center hover:bg-slate-50"
                          title={r.notes ? 'Has notes' : 'Notes'}
                          onClick={() => {
                            const notes = window.prompt('Daily note for this candidate', r.notes ?? '')
                            if (notes === null) return
                            mark.mutate({ candidateId: r.candidateId, dayStatus: r.dayStatus, notes })
                          }}
                        >
                          <FileText className={cn('size-4', r.notes ? 'text-brand' : 'text-slate-500')} />
                        </button>
                        <button
                          type="button"
                          className="size-8 rounded-lg border border-line grid place-items-center hover:bg-slate-50"
                          onClick={() => setMenuOpen((id) => (id === r.candidateId ? null : r.candidateId))}
                        >
                          <MoreVertical className="size-4 text-slate-500" />
                        </button>
                        {menuOpen === r.candidateId ? (
                          <div className="absolute right-0 top-9 z-10 min-w-44 rounded-xl border border-line bg-white shadow-lg py-1">
                            <Link to={`/candidates/${r.candidateId}`} className="block px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setMenuOpen(null)}>
                              View profile
                            </Link>
                            <Link to="/candidates" className="block px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setMenuOpen(null)}>
                              Edit candidate
                            </Link>
                            {!r.supporterId ? (
                              <button type="button" className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50" onClick={() => navigate('/assignments')}>
                                Assign supporter
                              </button>
                            ) : null}
                            {r.dayStatus !== 'MISSED' ? (
                              <button
                                type="button"
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 text-rose-700"
                                onClick={() => mark.mutate({ candidateId: r.candidateId, dayStatus: 'MISSED' })}
                              >
                                Mark missed
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                                onClick={() => mark.mutate({ candidateId: r.candidateId, dayStatus: 'PENDING' })}
                              >
                                Mark pending
                              </button>
                            )}
                            <button
                              type="button"
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                              onClick={() => mark.mutate({ candidateId: r.candidateId, dayStatus: 'NO_SUPPORT_REQUIRED' })}
                            >
                              No support required
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <footer className="px-5 py-3 border-t border-line flex items-center justify-between text-sm text-muted">
          <span>Showing {filtered.length} candidate{filtered.length === 1 ? '' : 's'}</span>
          <span>{anySessionLogged ? `${s?.totalHours ?? '0h 00m'} logged` : '— No session logged'}</span>
        </footer>
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-amber-100 text-amber-700 grid place-items-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-amber-950">
                {unassigned > 0
                  ? `${unassigned} candidate${unassigned === 1 ? '' : 's'} without a supporter`
                  : 'No assignment gaps'}
              </p>
              <p className="text-sm text-amber-800/80 mt-1">
                {unassigned > 0
                  ? `${unassignedRows[0]?.candidateName ?? 'A candidate'} needs a supporter assigned`
                  : 'All sheet candidates have a supporter assigned.'}
              </p>
              {unassigned > 0 ? (
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-orange-700 hover:underline"
                  onClick={() => navigate('/assignments')}
                >
                  Assign supporter →
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="dsms-card p-5">
          <h3 className="font-semibold inline-flex items-center gap-2 mb-3">
            <FileText className="size-4 text-brand" />
            Daily notes
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Pencil className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full border border-line rounded-xl pl-10 pr-3 py-2.5 text-sm"
                placeholder="Add handover notes or follow-ups..."
                value={dailyNote}
                onChange={(e) => {
                  setDailyNote(e.target.value)
                  setNoteMsg(null)
                }}
              />
            </div>
            <button
              type="button"
              className="rounded-xl border border-brand/40 text-brand px-4 py-2.5 text-sm font-semibold hover:bg-brand-soft whitespace-nowrap"
              onClick={() => {
                localStorage.setItem(`dsms-daily-note-${date}`, dailyNote)
                setNoteMsg('saved')
              }}
            >
              + Add note
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <p className="text-xs text-emerald-600 inline-flex items-center gap-1.5 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {noteMsg === 'saved' ? 'All changes saved.' : 'All changes saved.'}
        </p>
      </div>

      {showLog ? (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4" onClick={() => setShowLog(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Log session</h3>
              <button type="button" className="size-8 rounded-lg border border-line grid place-items-center" onClick={() => setShowLog(false)}>
                <X className="size-4" />
              </button>
            </div>
            <DailyLogSessionForm
              date={date}
              initialEngagementId={logEngagementId}
              onDone={() => {
                setShowLog(false)
                qc.invalidateQueries({ queryKey: ['daily-sheet'] })
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function DailyLogSessionForm({
  date,
  initialEngagementId,
  onDone,
}: {
  date: string
  initialEngagementId?: string
  onDone: () => void
}) {
  const { user } = useAuth()
  const engagements = useQuery({ queryKey: ['engagements'], queryFn: () => api<PageResponse<Engagement>>('/api/v1/engagements?size=100') })
  const experts = useQuery({ queryKey: ['experts'], queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=100') })
  const [engagementId, setEngagementId] = useState(initialEngagementId ?? '')
  const [expertId, setExpertId] = useState('')
  const [start, setStart] = useState('10:00')
  const [end, setEnd] = useState('11:00')
  const [reason, setReason] = useState('Logged from Daily Sheet')
  const [summary, setSummary] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  if (user?.role !== 'ADMIN' && user?.role !== 'COORDINATOR' && user?.role !== 'EXPERT') {
    return <p className="text-sm text-muted">Only staff or supporters can log sessions.</p>
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault()
        try {
          const startedOn = new Date(`${date}T${start}:00`).toISOString()
          const endedOn = new Date(`${date}T${end}:00`).toISOString()
          await api('/api/v1/work-entries/manual', {
            method: 'POST',
            body: JSON.stringify({
              engagementId,
              expertId: expertId || undefined,
              summary,
              reason,
              issueTopic: summary || 'Daily support',
              intervals: [{ startedOn, endedOn }],
            }),
          })
          setMsg('Session logged.')
          onDone()
        } catch (err) {
          setMsg(err instanceof Error ? err.message : 'Failed')
        }
      }}
    >
      <label className="block text-sm font-medium">
        Engagement
        <select className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={engagementId} onChange={(e) => setEngagementId(e.target.value)} required>
          <option value="">Select</option>
          {(engagements.data?.items ?? []).map((x) => (
            <option key={x.id} value={x.id}>{x.candidateName || x.title} ({x.status})</option>
          ))}
        </select>
      </label>
      {(user.role === 'ADMIN' || user.role === 'COORDINATOR') ? (
        <label className="block text-sm font-medium">
          Supporter
          <select className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={expertId} onChange={(e) => setExpertId(e.target.value)} required>
            <option value="">Select</option>
            {(experts.data?.items ?? []).map((x) => <option key={x.id} value={x.id}>{x.fullName}</option>)}
          </select>
        </label>
      ) : null}
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-sm font-medium">Start<input type="time" className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="block text-sm font-medium">End<input type="time" className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      </div>
      <label className="block text-sm font-medium">Work summary<textarea className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={summary} onChange={(e) => setSummary(e.target.value)} /></label>
      <label className="block text-sm font-medium">Reason<span className="text-rose-500"> *</span><input className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={reason} onChange={(e) => setReason(e.target.value)} required /></label>
      <button type="submit" className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark">Save session</button>
      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
    </form>
  )
}

function formatHoursMinutes(seconds: number) {
  const h = Math.floor(Math.max(0, seconds) / 3600)
  const m = Math.floor((Math.max(0, seconds) % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function formatClockTime(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(11, 16) || '—'
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function sessionStatusLabel(entry: WorkEntry) {
  if (entry.timerState === 'RUNNING') return 'Running'
  if (entry.timerState === 'PAUSED') return 'Paused'
  if (entry.reviewStatus === 'DISPUTED') return 'Disputed'
  if (entry.reviewStatus === 'PENDING' || entry.reviewStatus === 'AWAITING_REVIEW') return 'In review'
  return 'Completed'
}

function sessionStatusTone(label: string) {
  if (label === 'Running') return 'bg-violet-50 text-violet-700 border border-violet-100'
  if (label === 'Paused') return 'bg-amber-50 text-amber-700 border border-amber-100'
  if (label === 'Disputed') return 'bg-rose-50 text-rose-700 border border-rose-100'
  if (label === 'In review') return 'bg-orange-50 text-orange-700 border border-orange-100'
  return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
}

export function SessionsPage() {
  const { user } = useAuth()
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = today.slice(0, 8) + '01'
  const [from, setFrom] = useState(monthStart)
  const [to, setTo] = useState(today)
  const [q, setQ] = useState('')
  const [candidateFilter, setCandidateFilter] = useState('')
  const [supporterFilter, setSupporterFilter] = useState('')
  const [statusTab, setStatusTab] = useState<'ALL' | 'COMPLETED' | 'RUNNING' | 'REVIEW'>('ALL')
  const [showLog, setShowLog] = useState(false)

  const history = useQuery({
    queryKey: ['session-history', from, to],
    queryFn: () => api<WorkEntry[]>(`/api/v1/work-entries/history?from=${from}&to=${to}`),
  })
  const candidates = useQuery({
    queryKey: ['candidates', 'sessions'],
    queryFn: () => api<PageResponse<Candidate>>('/api/v1/candidates?size=100'),
  })
  const experts = useQuery({
    queryKey: ['experts', 'sessions'],
    queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=100'),
  })

  const allRows = (history.data ?? []).filter((e) => e.id)
  const filtered = allRows.filter((r) => {
    const label = sessionStatusLabel(r)
    if (statusTab === 'COMPLETED' && label !== 'Completed') return false
    if (statusTab === 'RUNNING' && label !== 'Running' && label !== 'Paused') return false
    if (statusTab === 'REVIEW' && label !== 'In review' && label !== 'Disputed') return false
    if (candidateFilter && r.candidateId !== candidateFilter) return false
    if (supporterFilter && r.expertId !== supporterFilter) return false
    if (!q.trim()) return true
    const needle = q.toLowerCase()
    return (r.candidateName ?? '').toLowerCase().includes(needle)
      || (r.groupName ?? '').toLowerCase().includes(needle)
      || (r.expertName ?? '').toLowerCase().includes(needle)
      || (r.displayCode ?? '').toLowerCase().includes(needle)
      || (r.sharedSummary ?? '').toLowerCase().includes(needle)
  })

  const totalSeconds = filtered.reduce((sum, r) => sum + (r.recordedSeconds || 0), 0)
  const completed = allRows.filter((r) => sessionStatusLabel(r) === 'Completed').length
  const running = allRows.filter((r) => ['Running', 'Paused'].includes(sessionStatusLabel(r))).length
  const inReview = allRows.filter((r) => ['In review', 'Disputed'].includes(sessionStatusLabel(r))).length

  const exportCsv = () => {
    const header = ['Code', 'Date', 'Candidate', 'Group', 'Supporter', 'Start', 'End', 'Duration', 'Status', 'Summary']
    const lines = filtered.map((r) => [
      r.displayCode ?? '',
      r.workDate ?? '',
      r.candidateName ?? '',
      r.groupName ?? '',
      r.expertName ?? '',
      r.startedOn ?? '',
      r.endedOn ?? '',
      formatHoursMinutes(r.recordedSeconds || 0),
      sessionStatusLabel(r),
      r.sharedSummary ?? '',
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-history-${from}_to_${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Session History"
        subtitle="Review logged support sessions, durations and corrections."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2"
              onClick={exportCsv}
            >
              <Download className="size-4" />
              Export
            </button>
            {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR' || user?.role === 'EXPERT') ? (
              <button
                type="button"
                className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark"
                onClick={() => setShowLog(true)}
              >
                + Log session
              </button>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard title="Sessions" value={allRows.length} tone="brand" icon={<History className="size-5" />} />
        <MetricCard title="Completed" value={completed} tone="green" icon={<CheckCircle2 className="size-5" />} />
        <MetricCard title="Running / paused" value={running} tone="violet" icon={<Play className="size-5" />} />
        <MetricCard title="Total hours" value={formatHoursMinutes(totalSeconds)} tone="sky" icon={<Clock3 className="size-5" />} />
      </div>

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-56 bg-white"
                placeholder="Search candidate, group..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <input type="date" className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={to} onChange={(e) => setTo(e.target.value)} />
            <select className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={candidateFilter} onChange={(e) => setCandidateFilter(e.target.value)}>
              <option value="">All candidates</option>
              {(candidates.data?.items ?? []).map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>
            <select className="rounded-xl border border-line px-3 py-2 text-sm bg-white" value={supporterFilter} onChange={(e) => setSupporterFilter(e.target.value)}>
              <option value="">All supporters</option>
              {(experts.data?.items ?? []).map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['ALL', 'All', allRows.length],
              ['COMPLETED', 'Completed', completed],
              ['RUNNING', 'Running', running],
              ['REVIEW', 'In review', inReview],
            ] as const).map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold border inline-flex items-center gap-2',
                  statusTab === key ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-line hover:bg-slate-50',
                )}
                onClick={() => setStatusTab(key)}
              >
                {label}
                <span className={cn('min-w-5 h-5 px-1.5 rounded-full grid place-items-center text-[11px] font-bold', statusTab === key ? 'bg-white/20' : 'bg-slate-100 text-slate-700')}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                {['Session', 'Candidate / Group', 'Supporter', 'Date', 'Time', 'Duration', 'Status', 'Summary'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td className="px-5 py-8 text-muted" colSpan={8}>{history.isLoading ? 'Loading sessions…' : 'No sessions in this range.'}</td></tr>
              ) : filtered.map((r) => {
                const label = sessionStatusLabel(r)
                return (
                  <tr key={r.id!} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{r.displayCode || '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-3">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(r.candidateName || 'C'))}>
                          {initials(r.candidateName || 'C')}
                        </span>
                        <span>
                          <span className="font-semibold block">{r.candidateName || '—'}</span>
                          <span className="text-xs text-muted">{r.groupName || 'No group'}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {r.expertName ? (
                        <div className="inline-flex items-center gap-2">
                          <span className={cn('size-7 rounded-full grid place-items-center text-[10px] font-bold', avatarTone(r.expertName))}>
                            {initials(r.expertName)}
                          </span>
                          <span>{r.expertName}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-muted whitespace-nowrap">
                      {r.workDate ? `${formatShortDate(r.workDate)} ${new Date(`${r.workDate}T00:00:00`).getFullYear()}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-muted whitespace-nowrap">
                      {formatClockTime(r.startedOn)} – {formatClockTime(r.endedOn)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">{formatHoursMinutes(r.recordedSeconds || 0)}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('dsms-chip inline-flex items-center gap-1.5', sessionStatusTone(label))}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted max-w-[220px] truncate" title={r.sharedSummary ?? ''}>
                      {r.sharedSummary || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <footer className="px-5 py-3 border-t border-line flex items-center justify-between text-sm text-muted">
          <span>Showing {filtered.length} of {allRows.length} sessions</span>
          <span>{formatHoursMinutes(totalSeconds)} in view</span>
        </footer>
      </section>

      {showLog ? (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4" onClick={() => setShowLog(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Log / correct session</h3>
              <button type="button" className="size-8 rounded-lg border border-line grid place-items-center" onClick={() => setShowLog(false)}>
                <X className="size-4" />
              </button>
            </div>
            <DailyLogSessionForm
              date={to || today}
              onDone={() => {
                setShowLog(false)
                history.refetch()
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function CandidateProfilePage() {
  const { id } = useParams()
  const profile = useQuery({
    queryKey: ['candidate-profile', id],
    enabled: Boolean(id),
    queryFn: () => api<Record<string, unknown>>(`/api/v1/candidates/${id}/profile`),
  })
  const timesheet = useQuery({
    queryKey: ['candidate-timesheet', id],
    enabled: Boolean(id),
    queryFn: () => api<{ days: Array<{ date: string; supporterName: string; sessionCount: number; duration: string }>; monthlyTotal: string }>(`/api/v1/candidates/${id}/timesheet`),
  })
  if (!profile.data) return <p>Loading profile…</p>
  const p = profile.data
  return (
    <div className="space-y-4">
      <div className="dsms-card p-5">
        <h2 className="text-lg font-semibold">{String(p.fullName)}</h2>
        <p className="text-sm text-muted mt-1">{String(p.technology ?? '-')} · {String(p.groupName ?? '-')} · since {String(p.supportSince ?? '-')} · {String(p.primarySupporterName ?? '-')} · {String(p.status)}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <MetricCard title="Support days" value={Number(p.supportDays ?? 0)} tone="brand" icon={<CalendarDays className="size-5" />} />
          <MetricCard title="Sessions" value={Number(p.sessions ?? 0)} tone="blue" icon={<History className="size-5" />} />
          <MetricCard title="Total hours" value={String(p.totalHours ?? '0h 00m')} tone="sky" icon={<Clock3 className="size-5" />} />
          <MetricCard title="Avg duration" value={String(p.averageDuration ?? '0h 00m')} tone="violet" icon={<Timer className="size-5" />} />
        </div>
      </div>
      <ResourceTable
        title="Monthly timesheet"
        rows={(timesheet.data?.days ?? []).map((d, i) => ({ id: String(i), ...d }))}
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'supporterName', label: 'Supporter' },
          { key: 'sessionCount', label: 'Sessions' },
          { key: 'duration', label: 'Duration' },
        ]}
        actions={<span className="text-sm text-muted">Total {timesheet.data?.monthlyTotal ?? '0h 00m'}</span>}
      />
    </div>
  )
}

export function ExpertProfilePage() {
  const { id } = useParams()
  const profile = useQuery({
    queryKey: ['expert-profile', id],
    enabled: Boolean(id),
    queryFn: () => api<Record<string, unknown>>(`/api/v1/experts/${id}/profile`),
  })
  const timesheet = useQuery({
    queryKey: ['expert-timesheet', id],
    enabled: Boolean(id),
    queryFn: () => api<{ candidates: Array<{ candidateName: string; sessionCount: number; duration: string }>; monthlyTotal: string }>(`/api/v1/experts/${id}/timesheet`),
  })
  if (!profile.data) return <p>Loading profile…</p>
  const p = profile.data
  return (
    <div className="space-y-4">
      <div className="dsms-card p-5">
        <h2 className="text-lg font-semibold">{String(p.fullName)}</h2>
        <p className="text-sm text-muted mt-1">Status {String(p.status)} · Active candidates {Number(p.activeCandidates ?? 0)}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <MetricCard title="Today hours" value={String(p.todayHours ?? '0h 00m')} tone="sky" icon={<Clock3 className="size-5" />} />
          <MetricCard title="Month hours" value={String(p.monthHours ?? '0h 00m')} tone="blue" icon={<Timer className="size-5" />} />
          <MetricCard title="Today sessions" value={Number(p.todaySessions ?? 0)} tone="violet" icon={<Play className="size-5" />} />
          <MetricCard title="Month sessions" value={Number(p.monthSessions ?? 0)} tone="green" icon={<CheckCircle2 className="size-5" />} />
        </div>
      </div>
      <ResourceTable
        title="Supporter monthly timesheet"
        rows={(timesheet.data?.candidates ?? []).map((c, i) => ({ id: String(i), ...c }))}
        columns={[
          { key: 'candidateName', label: 'Candidate' },
          { key: 'sessionCount', label: 'Sessions' },
          { key: 'duration', label: 'Hours' },
        ]}
        actions={<span className="text-sm text-muted">Total {timesheet.data?.monthlyTotal ?? '0h 00m'}</span>}
      />
    </div>
  )
}

export function TimesheetsPage() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [month, setMonth] = useState(today.slice(0, 7))
  const [tab, setTab] = useState<'CANDIDATES' | 'SUPPORTERS' | 'SESSIONS'>('CANDIDATES')
  const [q, setQ] = useState('')

  const from = `${month}-01`
  const toDate = new Date(`${month}-01T00:00:00`)
  toDate.setMonth(toDate.getMonth() + 1)
  toDate.setDate(0)
  const to = toDate.toISOString().slice(0, 10)

  const history = useQuery({
    queryKey: ['timesheets', month],
    queryFn: () => api<WorkEntry[]>(`/api/v1/work-entries/history?from=${from}&to=${to}`),
  })
  const candidates = useQuery({
    queryKey: ['candidates', 'timesheets'],
    queryFn: () => api<PageResponse<Candidate>>('/api/v1/candidates?size=100'),
  })
  const experts = useQuery({
    queryKey: ['experts', 'timesheets'],
    queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=100'),
  })

  const entries = (history.data ?? []).filter((e) => e.id)
  const totalSeconds = entries.reduce((sum, e) => sum + (e.recordedSeconds || 0), 0)

  const byCandidate = useMemo(() => {
    const map = new Map<string, { id: string; name: string; group: string; sessions: number; seconds: number }>()
    for (const e of entries) {
      const id = e.candidateId || e.candidateName || 'unknown'
      const current = map.get(id) ?? {
        id,
        name: e.candidateName || 'Unknown',
        group: e.groupName || '—',
        sessions: 0,
        seconds: 0,
      }
      current.sessions += 1
      current.seconds += e.recordedSeconds || 0
      map.set(id, current)
    }
    return Array.from(map.values()).sort((a, b) => b.seconds - a.seconds)
  }, [entries])

  const bySupporter = useMemo(() => {
    const map = new Map<string, { id: string; name: string; sessions: number; seconds: number; candidates: Set<string> }>()
    for (const e of entries) {
      const id = e.expertId || e.expertName || 'unknown'
      const current = map.get(id) ?? {
        id,
        name: e.expertName || 'Unknown',
        sessions: 0,
        seconds: 0,
        candidates: new Set<string>(),
      }
      current.sessions += 1
      current.seconds += e.recordedSeconds || 0
      if (e.candidateId) current.candidates.add(e.candidateId)
      map.set(id, current)
    }
    return Array.from(map.values())
      .map((r) => ({ ...r, candidateCount: r.candidates.size }))
      .sort((a, b) => b.seconds - a.seconds)
  }, [entries])

  const filteredCandidates = byCandidate.filter((r) => {
    if (!q.trim()) return true
    const needle = q.toLowerCase()
    return r.name.toLowerCase().includes(needle) || r.group.toLowerCase().includes(needle)
  })
  const filteredSupporters = bySupporter.filter((r) => {
    if (!q.trim()) return true
    return r.name.toLowerCase().includes(q.toLowerCase())
  })
  const filteredSessions = entries.filter((r) => {
    if (!q.trim()) return true
    const needle = q.toLowerCase()
    return (r.candidateName ?? '').toLowerCase().includes(needle)
      || (r.expertName ?? '').toLowerCase().includes(needle)
      || (r.groupName ?? '').toLowerCase().includes(needle)
  })

  const monthLabel = new Date(`${month}-01T00:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const exportCsv = () => {
    const header = tab === 'SUPPORTERS'
      ? ['Supporter', 'Candidates', 'Sessions', 'Hours']
      : tab === 'SESSIONS'
        ? ['Date', 'Candidate', 'Supporter', 'Duration', 'Status']
        : ['Candidate', 'Group', 'Sessions', 'Hours']
    const lines = (tab === 'SUPPORTERS'
      ? filteredSupporters.map((r) => [r.name, String(r.candidateCount), String(r.sessions), formatHoursMinutes(r.seconds)])
      : tab === 'SESSIONS'
        ? filteredSessions.map((r) => [r.workDate ?? '', r.candidateName ?? '', r.expertName ?? '', formatHoursMinutes(r.recordedSeconds || 0), sessionStatusLabel(r)])
        : filteredCandidates.map((r) => [r.name, r.group, String(r.sessions), formatHoursMinutes(r.seconds)])
    ).map((cols) => cols.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timesheets-${month}-${tab.toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Timesheets"
        subtitle="Monthly hours by candidate and supporter."
        actions={
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="month"
              className="rounded-xl border border-line px-3 py-2 text-sm bg-white"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <button
              type="button"
              className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2"
              onClick={exportCsv}
            >
              <Download className="size-4" />
              Export
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <CalendarDays className="size-4 text-brand" />
        <span className="font-semibold text-slate-700">{monthLabel}</span>
        <span>·</span>
        <span>{candidates.data?.totalElements ?? 0} candidates</span>
        <span>·</span>
        <span>{experts.data?.totalElements ?? 0} supporters</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard title="Sessions this month" value={entries.length} tone="brand" icon={<History className="size-5" />} />
        <MetricCard title="Candidates active" value={byCandidate.length} tone="green" icon={<Users className="size-5" />} />
        <MetricCard title="Supporters active" value={bySupporter.length} tone="violet" icon={<UserPlus className="size-5" />} />
        <MetricCard title="Total hours" value={formatHoursMinutes(totalSeconds)} tone="sky" icon={<Clock3 className="size-5" />} />
      </div>

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              {([
                ['CANDIDATES', 'By candidate', byCandidate.length],
                ['SUPPORTERS', 'By supporter', bySupporter.length],
                ['SESSIONS', 'Sessions', entries.length],
              ] as const).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold border inline-flex items-center gap-2',
                    tab === key ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-line hover:bg-slate-50',
                  )}
                  onClick={() => setTab(key)}
                >
                  {label}
                  <span className={cn('min-w-5 h-5 px-1.5 rounded-full grid place-items-center text-[11px] font-bold', tab === key ? 'bg-white/20' : 'bg-slate-100 text-slate-700')}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-56 bg-white"
                placeholder="Search..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="overflow-x-auto">
          {tab === 'CANDIDATES' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Candidate / Group', 'Sessions', 'Hours', 'Share', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={5}>{history.isLoading ? 'Loading…' : 'No timesheet data this month.'}</td></tr>
                ) : filteredCandidates.map((r) => {
                  const share = totalSeconds > 0 ? Math.round((r.seconds / totalSeconds) * 100) : 0
                  return (
                    <tr key={r.id} className="border-t border-line hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-3">
                          <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(r.name))}>{initials(r.name)}</span>
                          <span>
                            <span className="font-semibold block">{r.name}</span>
                            <span className="text-xs text-muted">{r.group}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold">{r.sessions}</td>
                      <td className="px-4 py-3.5 font-semibold">{formatHoursMinutes(r.seconds)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-brand rounded-full" style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-xs text-muted w-8">{share}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {r.id && r.id !== 'unknown' ? (
                          <button type="button" className="text-xs font-semibold text-brand hover:underline" onClick={() => navigate(`/candidates/${r.id}`)}>
                            View profile
                          </button>
                        ) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : null}

          {tab === 'SUPPORTERS' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Supporter', 'Candidates', 'Sessions', 'Hours', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSupporters.length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={5}>{history.isLoading ? 'Loading…' : 'No timesheet data this month.'}</td></tr>
                ) : filteredSupporters.map((r) => (
                  <tr key={r.id} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-3">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(r.name))}>{initials(r.name)}</span>
                        <span className="font-semibold">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold">{r.candidateCount}</td>
                    <td className="px-4 py-3.5 font-semibold">{r.sessions}</td>
                    <td className="px-4 py-3.5 font-semibold">{formatHoursMinutes(r.seconds)}</td>
                    <td className="px-4 py-3.5">
                      {r.id && r.id !== 'unknown' ? (
                        <button type="button" className="text-xs font-semibold text-brand hover:underline" onClick={() => navigate(`/experts/${r.id}`)}>
                          View profile
                        </button>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === 'SESSIONS' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Date', 'Candidate', 'Supporter', 'Duration', 'Status', 'Summary'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={6}>{history.isLoading ? 'Loading…' : 'No sessions this month.'}</td></tr>
                ) : filteredSessions.map((r) => {
                  const label = sessionStatusLabel(r)
                  return (
                    <tr key={r.id!} className="border-t border-line hover:bg-slate-50/70">
                      <td className="px-4 py-3.5 text-muted whitespace-nowrap">
                        {r.workDate ? `${formatShortDate(r.workDate)} ${new Date(`${r.workDate}T00:00:00`).getFullYear()}` : '—'}
                      </td>
                      <td className="px-4 py-3.5 font-semibold">{r.candidateName || '—'}</td>
                      <td className="px-4 py-3.5">{r.expertName || '—'}</td>
                      <td className="px-4 py-3.5 font-semibold">{formatHoursMinutes(r.recordedSeconds || 0)}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('dsms-chip inline-flex items-center gap-1.5', sessionStatusTone(label))}>
                          <span className="size-1.5 rounded-full bg-current" />
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted max-w-[220px] truncate">{r.sharedSummary || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : null}
        </div>
        <footer className="px-5 py-3 border-t border-line flex items-center justify-between text-sm text-muted">
          <span>
            {tab === 'CANDIDATES' ? `${filteredCandidates.length} candidates` : tab === 'SUPPORTERS' ? `${filteredSupporters.length} supporters` : `${filteredSessions.length} sessions`}
          </span>
          <span>Month total {formatHoursMinutes(totalSeconds)}</span>
        </footer>
      </section>
    </div>
  )
}

export function CandidatePaymentsPage() {
  const qc = useQueryClient()
  const candidates = useQuery({ queryKey: ['candidates'], queryFn: () => api<PageResponse<Candidate>>('/api/v1/candidates?size=200') })
  const q = useQuery({ queryKey: ['candidate-payments'], queryFn: () => api<CandidatePayment[]>('/api/v1/candidate-payments') })
  const [billingMonth, setBillingMonth] = useState('2026-09')
  const [candidateFilter, setCandidateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCharge, setShowCharge] = useState(false)
  const [showPay, setShowPay] = useState<CandidatePayment | null>(null)
  const [chargeCandidateId, setChargeCandidateId] = useState('')
  const [chargeAmount, setChargeAmount] = useState('10000')
  const [chargeDue, setChargeDue] = useState('2026-09-30')
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('UPI')
  const [payRef, setPayRef] = useState('')

  const create = useMutation({
    mutationFn: () => api('/api/v1/candidate-payments', {
      method: 'POST',
      body: JSON.stringify({
        candidateId: chargeCandidateId,
        billingMonth,
        expectedAmount: chargeAmount,
        paidAmount: '0',
        dueDate: chargeDue,
      }),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-payments'] })
      setShowCharge(false)
      setChargeCandidateId('')
    },
  })

  const recordPay = useMutation({
    mutationFn: (row: CandidatePayment) => {
      const nextPaid = (Number(row.paidAmount) + Number(payAmount || 0)).toFixed(2)
      return api(`/api/v1/candidate-payments/${row.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          expectedAmount: row.expectedAmount,
          paidAmount: nextPaid,
          dueDate: row.dueDate,
          paymentDate: new Date().toISOString().slice(0, 10),
          method: payMethod,
          externalReference: payRef || null,
          notes: row.notes ?? null,
        }),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-payments'] })
      setShowPay(null)
      setPayAmount('')
      setPayRef('')
    },
  })

  const rows = useMemo(() => {
    return (q.data ?? []).filter((r) => {
      if (r.billingMonth !== billingMonth) return false
      if (statusFilter && r.status !== statusFilter) return false
      if (!candidateFilter.trim()) return true
      const n = candidateFilter.toLowerCase()
      return [r.candidateName, r.groupName, r.candidateDisplayCode, r.candidateId]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(n))
    })
  }, [q.data, billingMonth, statusFilter, candidateFilter])

  const billed = rows.reduce((s, r) => s + Number(r.expectedAmount || 0), 0)
  const received = rows.reduce((s, r) => s + Number(r.paidAmount || 0), 0)
  const outstanding = rows.reduce((s, r) => s + Number(r.pendingAmount || 0), 0)
  const overdue = rows
    .filter((r) => r.status === 'OVERDUE' || (Number(r.pendingAmount) > 0 && r.dueDate && r.dueDate < new Date().toISOString().slice(0, 10)))
    .reduce((s, r) => s + Number(r.pendingAmount || 0), 0)

  const receipts = useMemo(() => {
    return (q.data ?? [])
      .filter((r) => Number(r.paidAmount) > 0 && r.paymentDate)
      .sort((a, b) => String(b.paymentDate).localeCompare(String(a.paymentDate)))
      .slice(0, 5)
  }, [q.data])

  const exportCsv = () => {
    const header = ['Candidate', 'Group', 'Billing period', 'Billed', 'Received', 'Outstanding', 'Due date', 'Status']
    const lines = rows.map((r) => [
      r.candidateName ?? '', r.groupName ?? '', formatLongMonth(`${r.billingMonth}-01`),
      r.expectedAmount, r.paidAmount, r.pendingAmount, r.dueDate ?? '', paymentStatusLabel(r.status),
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `candidate-payments-${billingMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5 pb-2">
      <PageHeader
        title="Candidate Payments"
        subtitle="Manage monthly charges, collections and outstanding balances."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-semibold">
              <Info className="size-3.5" />
              Demo data
            </span>
            <button type="button" onClick={exportCsv} className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2">
              <Download className="size-4" />
              Export
            </button>
            <button type="button" onClick={() => setShowCharge(true)} className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2">
              <Plus className="size-4" />
              Create charge
            </button>
            <button
              type="button"
              onClick={() => {
                const first = rows.find((r) => Number(r.pendingAmount) > 0)
                if (first) {
                  setShowPay(first)
                  setPayAmount(String(Number(first.pendingAmount)))
                } else setShowCharge(true)
              }}
              className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark inline-flex items-center gap-2"
            >
              <CreditCard className="size-4" />
              Record payment
            </button>
          </>
        }
      />

      <div className="dsms-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs font-semibold text-muted">
          Billing month
          <div className="relative mt-1">
            <CalendarDays className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="month" className="w-full border border-line rounded-xl pl-9 pr-3 py-2.5 text-sm" value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)} />
          </div>
        </label>
        <label className="text-xs font-semibold text-muted">
          Candidate
          <div className="relative mt-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="w-full border border-line rounded-xl pl-9 pr-3 py-2.5 text-sm" placeholder="Search candidates..." value={candidateFilter} onChange={(e) => setCandidateFilter(e.target.value)} />
          </div>
        </label>
        <label className="text-xs font-semibold text-muted">
          Status
          <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {['PAID', 'PARTIAL', 'PENDING', 'OVERDUE', 'WAIVED'].map((s) => <option key={s} value={s}>{paymentStatusLabel(s)}</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title="Billed" value={formatInrAmount(billed)} tone="green" icon={<FileText className="size-5" />} />
        <MetricCard title="Received" value={formatInrAmount(received)} tone="blue" icon={<CreditCard className="size-5" />} />
        <MetricCard title="Outstanding" value={formatInrAmount(outstanding)} tone="orange" icon={<Clock3 className="size-5" />} />
        <div className="dsms-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{formatInrAmount(overdue)}</p>
              <p className="text-xs font-medium text-muted mt-1">Overdue</p>
              <p className="text-[11px] text-slate-400 mt-1">Included in outstanding</p>
            </div>
            <div className="size-10 rounded-xl grid place-items-center shrink-0 bg-rose-50 text-rose-600">
              <AlertTriangle className="size-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="dsms-card overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-bold text-ink">Monthly charges</h2>
          <p className="text-xs text-muted mt-0.5">{formatLongMonth(`${billingMonth}-01`)} · {rows.length} candidates</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Candidate / Group</th>
                <th className="text-left font-semibold px-4 py-3">Billing period</th>
                <th className="text-right font-semibold px-4 py-3">Billed</th>
                <th className="text-right font-semibold px-4 py-3">Received</th>
                <th className="text-right font-semibold px-4 py-3">Outstanding</th>
                <th className="text-left font-semibold px-4 py-3">Due date</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-right font-semibold px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted">No charges for this month.</td></tr>
              ) : rows.map((r) => {
                const name = r.candidateName || 'Candidate'
                const isOverdue = r.status === 'OVERDUE' || (Number(r.pendingAmount) > 0 && !!r.dueDate && r.dueDate < new Date().toISOString().slice(0, 10))
                const displayStatus = r.status === 'OVERDUE' ? 'PENDING' : r.status
                return (
                  <tr key={r.id} className="border-t border-line hover:bg-slate-50/60">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(name))}>{initials(name)}</span>
                        <div>
                          <p className="font-semibold text-ink">{name}</p>
                          <p className="text-xs text-muted">{r.groupName || r.candidateDisplayCode || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{formatLongMonth(`${r.billingMonth}-01`)}</td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatInrAmount(r.expectedAmount)}</td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatInrAmount(r.paidAmount)}</td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatInrAmount(r.pendingAmount)}</td>
                    <td className="px-4 py-3.5">{r.dueDate ? formatShortDate(r.dueDate) : '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', paymentStatusTone(displayStatus))}>
                          <span className={cn('size-1.5 rounded-full', paymentStatusDot(displayStatus))} />
                          {paymentStatusLabel(displayStatus)}
                        </span>
                        {isOverdue && displayStatus !== 'OVERDUE' ? (
                          <span className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold">Overdue</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {Number(r.pendingAmount) <= 0 ? (
                        <button type="button" className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5">
                          <Eye className="size-3.5" />
                          View receipt
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setShowPay(r); setPayAmount(String(Number(r.pendingAmount))) }}
                          className="rounded-lg border border-brand/40 text-brand px-3 py-1.5 text-xs font-semibold hover:bg-brand-soft inline-flex items-center gap-1.5"
                        >
                          <CreditCard className="size-3.5" />
                          Record payment
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {rows.length > 0 ? (
              <tfoot>
                <tr className="border-t border-line bg-slate-50/80 font-semibold">
                  <td className="px-4 py-3" colSpan={2}>Total</td>
                  <td className="px-4 py-3 text-right">{formatInrAmount(billed)}</td>
                  <td className="px-4 py-3 text-right">{formatInrAmount(received)}</td>
                  <td className="px-4 py-3 text-right">{formatInrAmount(outstanding)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="dsms-card xl:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h3 className="font-bold">Recent receipts</h3>
            <button type="button" className="text-xs font-semibold text-brand hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Date</th>
                  <th className="text-left font-semibold px-4 py-3">Candidate</th>
                  <th className="text-right font-semibold px-4 py-3">Amount</th>
                  <th className="text-left font-semibold px-4 py-3">Method</th>
                  <th className="text-left font-semibold px-4 py-3">Reference</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {receipts.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">No receipts yet.</td></tr>
                ) : receipts.map((r) => (
                  <tr key={r.id} className="border-t border-line">
                    <td className="px-4 py-3">{r.paymentDate ? formatShortDate(r.paymentDate) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn('size-7 rounded-full grid place-items-center text-[10px] font-bold', avatarTone(r.candidateName || 'C'))}>
                          {initials(r.candidateName || 'C')}
                        </span>
                        <span className="font-medium">{r.candidateName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatInrAmount(r.paidAmount)}</td>
                    <td className="px-4 py-3">{r.method || '—'}</td>
                    <td className="px-4 py-3 text-muted">{r.externalReference || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className="size-8 rounded-lg border border-line grid place-items-center text-muted hover:bg-slate-50">
                        <FileText className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dsms-card p-4 space-y-2">
          <h3 className="font-bold px-1 mb-2">Quick actions</h3>
          {[
            { icon: <History className="size-4" />, title: 'View payment history', sub: 'See all charges and payments' },
            { icon: <Wallet className="size-4" />, title: 'Manage advance credits', sub: 'Adjust and apply candidate credits' },
            { icon: <Download className="size-4" />, title: 'Export statement', sub: 'Download candidate payment report', onClick: exportCsv },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={item.onClick}
              className="w-full flex items-center gap-3 rounded-xl border border-line px-3 py-3 text-left hover:bg-slate-50"
            >
              <span className="size-9 rounded-xl bg-brand-soft text-brand grid place-items-center shrink-0">{item.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="block text-xs text-muted">{item.sub}</span>
              </span>
              <ArrowRight className="size-4 text-muted" />
            </button>
          ))}
        </div>
      </div>

      {showCharge ? (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4" onClick={() => setShowCharge(false)}>
          <form
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); create.mutate() }}
          >
            <h3 className="text-lg font-bold">Create charge</h3>
            <label className="block text-xs font-semibold text-muted">Candidate
              <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={chargeCandidateId} onChange={(e) => setChargeCandidateId(e.target.value)} required>
                <option value="">Select candidate</option>
                {(candidates.data?.items ?? []).map((c) => <option key={c.id} value={c.id}>{c.displayCode} — {c.fullName}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted">Amount
              <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} required />
            </label>
            <label className="block text-xs font-semibold text-muted">Due date
              <input type="date" className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={chargeDue} onChange={(e) => setChargeDue(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="rounded-xl border border-line px-4 py-2 text-sm font-semibold" onClick={() => setShowCharge(false)}>Cancel</button>
              <button className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold" disabled={create.isPending}>Create</button>
            </div>
          </form>
        </div>
      ) : null}

      {showPay ? (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4" onClick={() => setShowPay(null)}>
          <form
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); recordPay.mutate(showPay) }}
          >
            <h3 className="text-lg font-bold">Record payment</h3>
            <p className="text-sm text-muted">{showPay.candidateName} · outstanding {formatInrAmount(showPay.pendingAmount)}</p>
            <label className="block text-xs font-semibold text-muted">Amount
              <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
            </label>
            <label className="block text-xs font-semibold text-muted">Method
              <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                {['UPI', 'Bank transfer', 'Cash', 'Card'].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted">Reference
              <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="UPI123 / NEFT…" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="rounded-xl border border-line px-4 py-2 text-sm font-semibold" onClick={() => setShowPay(null)}>Cancel</button>
              <button className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold" disabled={recordPay.isPending}>Save payment</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export function SupporterPaymentsPage() {
  const qc = useQueryClient()
  const experts = useQuery({ queryKey: ['experts'], queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=200') })
  const q = useQuery({ queryKey: ['supporter-payments'], queryFn: () => api<SupporterPayment[]>('/api/v1/supporter-payments') })
  const [billingMonth, setBillingMonth] = useState('2026-09')
  const [search, setSearch] = useState('')
  const [modelFilter, setModelFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showDraft, setShowDraft] = useState(false)
  const [showPayout, setShowPayout] = useState<SupporterPayment | null>(null)
  const [draftExpertId, setDraftExpertId] = useState('')
  const [draftModel, setDraftModel] = useState('HOURLY')
  const [draftBase, setDraftBase] = useState('')
  const [draftAdj, setDraftAdj] = useState('0')
  const [draftReason, setDraftReason] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')

  const create = useMutation({
    mutationFn: () => api('/api/v1/supporter-payments', {
      method: 'POST',
      body: JSON.stringify({
        expertId: draftExpertId,
        billingMonth,
        paymentModel: draftModel,
        baseAmount: draftBase || null,
        adjustmentAmount: draftAdj,
        adjustmentReason: draftReason || null,
        status: 'DRAFT',
      }),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supporter-payments'] })
      setShowDraft(false)
      setDraftExpertId('')
      setDraftBase('')
      setDraftAdj('0')
      setDraftReason('')
    },
  })

  const updatePayout = useMutation({
    mutationFn: ({ row, patch }: { row: SupporterPayment; patch: Record<string, unknown> }) =>
      api(`/api/v1/supporter-payments/${row.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          paymentModel: row.paymentModel,
          baseAmount: row.baseAmount,
          adjustmentAmount: row.adjustmentAmount,
          adjustmentReason: row.adjustmentReason ?? null,
          amountPaid: row.amountPaid,
          notes: row.notes ?? null,
          status: row.status,
          ...patch,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supporter-payments'] })
      setShowPayout(null)
      setPayoutAmount('')
    },
  })

  const rows = useMemo(() => {
    return (q.data ?? []).filter((r) => {
      if (r.billingMonth !== billingMonth) return false
      if (modelFilter && r.paymentModel !== modelFilter) return false
      if (statusFilter && r.status !== statusFilter) return false
      if (!search.trim()) return true
      const n = search.toLowerCase()
      return [r.expertName, r.groupName, r.expertDisplayCode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(n))
    })
  }, [q.data, billingMonth, modelFilter, statusFilter, search])

  const selected = rows.find((r) => r.id === selectedId) ?? rows[0] ?? null

  const draftAmount = rows.filter((r) => r.status === 'DRAFT').reduce((s, r) => s + Number(r.finalPayable || 0), 0)
  const approved = rows.filter((r) => r.status !== 'DRAFT')
  const approvedPayable = approved.reduce((s, r) => s + Number(r.finalPayable || 0), 0)
  const paid = approved.reduce((s, r) => s + Number(r.amountPaid || 0), 0)
  const remaining = Math.max(0, approvedPayable - paid)
  const draftCount = rows.filter((r) => r.status === 'DRAFT').length

  const exportCsv = () => {
    const header = ['Supporter', 'Model', 'Base', 'Adjustment', 'Payable', 'Paid', 'Balance', 'Status']
    const lines = rows.map((r) => [
      r.expertName ?? '', modelLabel(r.paymentModel), r.baseAmount, r.adjustmentAmount,
      r.finalPayable, r.amountPaid, r.balanceAmount ?? '', paymentStatusLabel(r.status),
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supporter-payments-${billingMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5 pb-2">
      <PageHeader
        title="Supporter Payments"
        subtitle="Review earnings, approve payouts and track payment balances."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-semibold">
              <Info className="size-3.5" />
              Demo data
            </span>
            <button type="button" onClick={exportCsv} className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2">
              <Download className="size-4" />
              Export
            </button>
            <button type="button" onClick={() => setShowDraft(true)} className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark inline-flex items-center gap-2">
              <Plus className="size-4" />
              Create payout draft
            </button>
          </>
        }
      />

      <div className="dsms-card p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <label className="text-xs font-semibold text-muted">
          Payout month
          <div className="relative mt-1">
            <CalendarDays className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="month" className="w-full border border-line rounded-xl pl-9 pr-3 py-2.5 text-sm" value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)} />
          </div>
        </label>
        <label className="text-xs font-semibold text-muted">
          Search supporters
          <div className="relative mt-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="w-full border border-line rounded-xl pl-9 pr-3 py-2.5 text-sm" placeholder="Search supporters..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </label>
        <label className="text-xs font-semibold text-muted">
          Model
          <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={modelFilter} onChange={(e) => setModelFilter(e.target.value)}>
            <option value="">All models</option>
            {['HOURLY', 'FIXED_MONTHLY', 'PER_CANDIDATE', 'CUSTOM'].map((m) => <option key={m} value={m}>{modelLabel(m)}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-muted">
          Status
          <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {['DRAFT', 'PENDING', 'PARTIAL', 'PAID'].map((s) => <option key={s} value={s}>{paymentStatusLabel(s)}</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title="Draft amount" value={formatInrAmount(draftAmount)} tone="sky" icon={<FileText className="size-5" />} />
        <MetricCard title="Approved payable" value={formatInrAmount(approvedPayable)} tone="green" icon={<CheckCircle2 className="size-5" />} />
        <MetricCard title="Paid" value={formatInrAmount(paid)} tone="blue" icon={<CreditCard className="size-5" />} />
        <div className="dsms-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{formatInrAmount(remaining)}</p>
              <p className="text-xs font-medium text-muted mt-1">Remaining payable</p>
              <p className="text-[11px] text-slate-400 mt-1">Approved totals exclude drafts</p>
            </div>
            <div className="size-10 rounded-xl grid place-items-center shrink-0 bg-amber-50 text-amber-600">
              <Clock3 className="size-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="dsms-card overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-bold text-ink">Monthly payouts</h2>
          <p className="text-xs text-muted mt-0.5">{formatLongMonth(`${billingMonth}-01`)}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Supporter</th>
                <th className="text-left font-semibold px-4 py-3">Model / Calculation</th>
                <th className="text-right font-semibold px-4 py-3">Base</th>
                <th className="text-right font-semibold px-4 py-3">Adjustment</th>
                <th className="text-right font-semibold px-4 py-3">Payable</th>
                <th className="text-right font-semibold px-4 py-3">Paid</th>
                <th className="text-right font-semibold px-4 py-3">Balance</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-right font-semibold px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-muted">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-muted">No payouts for this month.</td></tr>
              ) : rows.map((r) => {
                const name = r.expertName || 'Supporter'
                const label = r.expertDisplayCode ? `${r.expertDisplayCode}-${name}` : name
                const adj = Number(r.adjustmentAmount || 0)
                const balance = Number(r.balanceAmount ?? (Number(r.finalPayable) - Number(r.amountPaid)))
                const active = selected?.id === r.id
                return (
                  <tr
                    key={r.id}
                    className={cn('border-t border-line cursor-pointer', active ? 'bg-teal-50/50' : 'hover:bg-slate-50/60')}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(name))}>{initials(name)}</span>
                        <div>
                          <p className="font-semibold text-ink">{label}</p>
                          <p className="text-xs text-muted">{r.groupName || `${name} Support`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium">{modelLabel(r.paymentModel)}</p>
                      <p className="text-xs text-muted">{r.calculationLabel || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatInrAmount(r.baseAmount)}</td>
                    <td className={cn('px-4 py-3.5 text-right font-medium', adj > 0 ? 'text-emerald-600' : adj < 0 ? 'text-rose-600' : 'text-slate-600')}>
                      {adj > 0 ? `+${formatInrAmount(adj)}` : formatInrAmount(adj)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold">{formatInrAmount(r.finalPayable)}</td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatInrAmount(r.amountPaid)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <p className="font-medium">{formatInrAmount(balance)}</p>
                      {r.status === 'DRAFT' ? <p className="text-[10px] text-muted">Proposed</p> : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', paymentStatusTone(r.status))}>
                        <span className={cn('size-1.5 rounded-full', paymentStatusDot(r.status))} />
                        {paymentStatusLabel(r.status)}
                      </span>
                      {r.status === 'DRAFT' ? <p className="text-[10px] text-muted mt-1">Not yet approved</p> : null}
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      {r.status === 'DRAFT' ? (
                        <button
                          type="button"
                          onClick={() => updatePayout.mutate({ row: r, patch: { status: 'PENDING' } })}
                          className="rounded-lg border border-brand/40 text-brand px-3 py-1.5 text-xs font-semibold hover:bg-brand-soft inline-flex items-center gap-1.5"
                        >
                          <Eye className="size-3.5" />
                          Review draft
                        </button>
                      ) : r.status === 'PAID' ? (
                        <button type="button" onClick={() => setSelectedId(r.id)} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5">
                          <Eye className="size-3.5" />
                          View details
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setShowPayout(r); setPayoutAmount(String(balance)) }}
                          className="rounded-lg border border-brand/40 text-brand px-3 py-1.5 text-xs font-semibold hover:bg-brand-soft inline-flex items-center gap-1.5"
                        >
                          <CreditCard className="size-3.5" />
                          Record payout
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-line text-xs text-muted">
          {rows.length} supporters · {draftCount} draft{draftCount === 1 ? '' : 's'} awaiting review
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="dsms-card p-5">
          <h3 className="font-bold">Calculation details{selected ? ` · ${selected.expertName}` : ''}</h3>
          {selected ? (
            <>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: 'Approved hours', value: `${selected.approvedHours ?? '0'}h`, icon: <Timer className="size-4" />, tone: 'bg-sky-50 text-sky-700' },
                  { label: 'Hourly rate', value: formatInrAmount(selected.hourlyRate || 0), icon: <IndianRupee className="size-4" />, tone: 'bg-violet-50 text-violet-700' },
                  { label: 'Base', value: formatInrAmount(selected.baseAmount), icon: <FileText className="size-4" />, tone: 'bg-slate-100 text-slate-700' },
                  { label: 'Bonus', value: `${Number(selected.adjustmentAmount) >= 0 ? '+' : ''}${formatInrAmount(selected.adjustmentAmount)}`, icon: <CircleDollarSign className="size-4" />, tone: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Payable', value: formatInrAmount(selected.finalPayable), icon: <Wallet className="size-4" />, tone: 'bg-brand-soft text-brand' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-line p-3">
                    <div className={cn('size-8 rounded-lg grid place-items-center mb-2', item.tone)}>{item.icon}</div>
                    <p className="text-[11px] text-muted">{item.label}</p>
                    <p className="text-sm font-bold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-4 text-sm font-semibold text-brand inline-flex items-center gap-1.5 hover:underline">
                View approved sessions
                <ArrowRight className="size-3.5" />
              </button>
            </>
          ) : (
            <p className="text-sm text-muted mt-3">Select a payout row to see calculation details.</p>
          )}
        </div>
        <div className="dsms-card p-5">
          <h3 className="font-bold mb-4">Payout workflow</h3>
          <ol className="space-y-4">
            {[
              { step: 1, title: 'Draft', desc: 'Payouts calculated from approved sessions' },
              { step: 2, title: 'Review & approve', desc: 'Check amounts, adjust bonuses or deductions' },
              { step: 3, title: 'Record payout', desc: 'Record bank / UPI transfers against balances' },
            ].map((item, idx) => (
              <li key={item.step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="size-8 rounded-full bg-brand text-white text-sm font-bold grid place-items-center">{item.step}</span>
                  {idx < 2 ? <span className="w-px flex-1 bg-line my-1" /> : null}
                </div>
                <div className="pb-2">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" className="mt-2 text-sm font-semibold text-brand inline-flex items-center gap-1.5 hover:underline">
            <RefreshCw className="size-3.5" />
            View payout history
          </button>
        </div>
      </div>

      {showDraft ? (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4" onClick={() => setShowDraft(false)}>
          <form
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); create.mutate() }}
          >
            <h3 className="text-lg font-bold">Create payout draft</h3>
            <label className="block text-xs font-semibold text-muted">Supporter
              <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={draftExpertId} onChange={(e) => setDraftExpertId(e.target.value)} required>
                <option value="">Select supporter</option>
                {(experts.data?.items ?? []).map((e) => <option key={e.id} value={e.id}>{e.displayCode} — {e.fullName}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted">Model
              <select className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={draftModel} onChange={(e) => setDraftModel(e.target.value)}>
                {['HOURLY', 'FIXED_MONTHLY', 'PER_CANDIDATE', 'CUSTOM'].map((m) => <option key={m} value={m}>{modelLabel(m)}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted">Base amount (optional)
              <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={draftBase} onChange={(e) => setDraftBase(e.target.value)} placeholder="Auto from hours / rate" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-muted">Adjustment
                <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={draftAdj} onChange={(e) => setDraftAdj(e.target.value)} />
              </label>
              <label className="block text-xs font-semibold text-muted">Reason
                <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={draftReason} onChange={(e) => setDraftReason(e.target.value)} />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="rounded-xl border border-line px-4 py-2 text-sm font-semibold" onClick={() => setShowDraft(false)}>Cancel</button>
              <button className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold" disabled={create.isPending}>Create draft</button>
            </div>
          </form>
        </div>
      ) : null}

      {showPayout ? (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4" onClick={() => setShowPayout(null)}>
          <form
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault()
              const nextPaid = (Number(showPayout.amountPaid) + Number(payoutAmount || 0)).toFixed(2)
              updatePayout.mutate({
                row: showPayout,
                patch: { amountPaid: nextPaid, status: null },
              })
            }}
          >
            <h3 className="text-lg font-bold">Record payout</h3>
            <p className="text-sm text-muted">{showPayout.expertName} · balance {formatInrAmount(showPayout.balanceAmount || 0)}</p>
            <label className="block text-xs font-semibold text-muted">Amount
              <input className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 text-sm" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} required />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="rounded-xl border border-line px-4 py-2 text-sm font-semibold" onClick={() => setShowPayout(null)}>Cancel</button>
              <button className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold" disabled={updatePayout.isPending}>Save payout</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export function ReportsPage() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [tab, setTab] = useState<'DAILY' | 'CANDIDATE' | 'SUPPORTER' | 'PAYMENTS'>('DAILY')
  const [date, setDate] = useState(today)
  const [month, setMonth] = useState(today.slice(0, 7))
  const [techFilter, setTechFilter] = useState('')
  const [supporterFilter, setSupporterFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [applied, setApplied] = useState({ date: today, month: today.slice(0, 7), tech: '', supporter: '', status: '' })
  const [tableQ, setTableQ] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(8)
  const [quickRange, setQuickRange] = useState<'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH'>('TODAY')
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const experts = useQuery({
    queryKey: ['experts', 'reports'],
    queryFn: () => api<PageResponse<Expert>>('/api/v1/experts?size=100'),
  })
  const skills = useQuery({ queryKey: ['skills'], queryFn: () => api<Skill[]>('/api/v1/skills') })
  const daily = useQuery({
    queryKey: ['report-daily', applied.date],
    enabled: tab === 'DAILY',
    queryFn: () => api<DailySheet>(`/api/v1/daily-sheet?date=${applied.date}`),
  })
  const candidateSummary = useQuery({
    queryKey: ['report-candidate-summary', applied.month],
    enabled: tab === 'CANDIDATE',
    queryFn: () => api<Array<Record<string, unknown>>>(`/api/v1/reports/candidate-summary?month=${applied.month}`),
  })
  const supporterHours = useQuery({
    queryKey: ['report-supporter-hours', applied.month],
    enabled: tab === 'SUPPORTER',
    queryFn: () => api<Array<Record<string, unknown>>>(`/api/v1/reports/supporter-workload?month=${applied.month}`),
  })
  const payments = useQuery({
    queryKey: ['report-payments'],
    enabled: tab === 'PAYMENTS',
    queryFn: () => api<CandidatePayment[]>('/api/v1/candidate-payments'),
  })

  const applyFilters = () => {
    setApplied({ date, month, tech: techFilter, supporter: supporterFilter, status: statusFilter })
    setPage(0)
  }
  const resetFilters = () => {
    setDate(today)
    setMonth(today.slice(0, 7))
    setTechFilter('')
    setSupporterFilter('')
    setStatusFilter('')
    setQuickRange('TODAY')
    setApplied({ date: today, month: today.slice(0, 7), tech: '', supporter: '', status: '' })
    setTableQ('')
    setPage(0)
  }

  const setQuick = (key: typeof quickRange) => {
    setQuickRange(key)
    const d = new Date(`${today}T00:00:00`)
    let nextDate = today
    let nextMonth = today.slice(0, 7)
    if (key === 'TODAY') {
      nextDate = today
    } else if (key === 'YESTERDAY') {
      d.setDate(d.getDate() - 1)
      nextDate = d.toISOString().slice(0, 10)
    } else if (key === 'WEEK') {
      const day = d.getDay() || 7
      d.setDate(d.getDate() - day + 1)
      nextDate = d.toISOString().slice(0, 10)
    } else {
      nextDate = `${today.slice(0, 7)}-01`
      nextMonth = today.slice(0, 7)
    }
    setDate(nextDate)
    setMonth(nextMonth)
    setApplied((prev) => ({ ...prev, date: nextDate, month: nextMonth }))
    setPage(0)
  }

  const statusLabel = (status: string) => {
    if (status === 'COMPLETED') return 'Supported'
    return status.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }

  const statusTone = (status: string) => {
    if (status === 'MISSED') return 'bg-rose-50 text-rose-700 border border-rose-100'
    if (status === 'RUNNING') return 'bg-violet-50 text-violet-700 border border-violet-100'
    if (status === 'COMPLETED' || status === 'ACTIVE') return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    if (status === 'PENDING') return 'bg-amber-50 text-amber-800 border border-amber-100'
    return 'bg-slate-100 text-slate-700 border border-slate-200'
  }

  const techTone = (tech: string) => {
    const t = tech.toLowerCase()
    if (t.includes('java')) return 'bg-sky-100 text-sky-800'
    if (t.includes('data')) return 'bg-violet-100 text-violet-800'
    if (t.includes('python')) return 'bg-emerald-100 text-emerald-800'
    if (t.includes('react') || t.includes('ui')) return 'bg-cyan-100 text-cyan-800'
    if (t.includes('cloud') || t.includes('aws')) return 'bg-orange-100 text-orange-800'
    return 'bg-slate-100 text-slate-600'
  }

  type DailyRow = DailySheet['rows'][number]
  const dailyRows = (daily.data?.rows ?? []).filter((r) => {
    if (applied.tech && (r.technology ?? '') !== applied.tech) return false
    if (applied.supporter === '__UNASSIGNED__' && r.supporterId) return false
    if (applied.supporter && applied.supporter !== '__UNASSIGNED__' && r.supporterId !== applied.supporter) return false
    if (applied.status && r.dayStatus !== applied.status) return false
    if (!tableQ.trim()) return true
    const n = tableQ.toLowerCase()
    return r.candidateName.toLowerCase().includes(n)
      || (r.groupName ?? '').toLowerCase().includes(n)
      || (r.supporterName ?? '').toLowerCase().includes(n)
      || (r.technology ?? '').toLowerCase().includes(n)
  })

  const candidateRows = (candidateSummary.data ?? []).filter((r) => {
    if (!tableQ.trim()) return true
    const n = tableQ.toLowerCase()
    return String(r.candidate ?? '').toLowerCase().includes(n)
      || String(r.group ?? '').toLowerCase().includes(n)
  })

  const supporterRows = (supporterHours.data ?? []).filter((r) => {
    if (!tableQ.trim()) return true
    return String(r.name ?? '').toLowerCase().includes(tableQ.toLowerCase())
  })

  const paymentRows = (payments.data ?? []).filter((r) => {
    if (!tableQ.trim()) return true
    return r.billingMonth.includes(tableQ) || r.status.toLowerCase().includes(tableQ.toLowerCase())
  })

  const activeRows =
    tab === 'DAILY' ? dailyRows
      : tab === 'CANDIDATE' ? candidateRows
        : tab === 'SUPPORTER' ? supporterRows
          : paymentRows

  const pageCount = Math.max(1, Math.ceil(activeRows.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const paged = activeRows.slice(safePage * pageSize, safePage * pageSize + pageSize)

  const summary = daily.data?.summary
  const metrics = tab === 'DAILY' ? {
    a: summary?.active ?? dailyRows.length,
    b: summary?.supported ?? 0,
    c: (summary?.pending ?? 0) + (summary?.missed ?? 0),
    d: summary?.totalHours ?? '0h 00m',
    labels: ['Candidates', 'Supported', 'Pending', 'Total hours'] as const,
  } : tab === 'CANDIDATE' ? {
    a: candidateRows.length,
    b: candidateRows.filter((r) => String(r.status) === 'ACTIVE').length,
    c: candidateRows.reduce((s, r) => s + Number(r.sessions ?? 0), 0),
    d: formatHoursMinutes(candidateRows.reduce((s, r) => {
      const dur = String(r.duration ?? '0h 00m')
      const m = dur.match(/(\d+)h\s*(\d+)m/)
      return s + (m ? Number(m[1]) * 3600 + Number(m[2]) * 60 : 0)
    }, 0)),
    labels: ['Candidates', 'Active', 'Sessions', 'Total hours'] as const,
  } : tab === 'SUPPORTER' ? {
    a: supporterRows.length,
    b: supporterRows.filter((r) => String(r.status) !== 'INACTIVE').length,
    c: supporterRows.reduce((s, r) => s + Number(r.monthSeconds ?? 0), 0) > 0
      ? supporterRows.filter((r) => Number(r.monthSeconds ?? 0) > 0).length
      : 0,
    d: formatHoursMinutes(supporterRows.reduce((s, r) => s + Number(r.monthSeconds ?? 0), 0)),
    labels: ['Supporters', 'Active', 'With hours', 'Total hours'] as const,
  } : {
    a: paymentRows.length,
    b: paymentRows.filter((r) => r.status === 'PAID').length,
    c: paymentRows.filter((r) => r.status === 'PENDING' || r.status === 'PARTIAL' || r.status === 'OVERDUE').length,
    d: `₹${paymentRows.reduce((s, r) => s + Number(r.pendingAmount || 0), 0).toLocaleString('en-IN')}`,
    labels: ['Records', 'Paid', 'Pending', 'Pending amount'] as const,
  }

  const dateLabel = new Date(`${applied.date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  const exportCsv = () => {
    const type =
      tab === 'DAILY' ? 'daily-support'
        : tab === 'CANDIDATE' ? 'candidate-summary'
          : tab === 'SUPPORTER' ? 'supporter-workload'
            : 'payments'
    if (tab === 'PAYMENTS') {
      const header = ['Billing month', 'Expected', 'Paid', 'Pending', 'Status']
      const lines = paymentRows.map((r) => [r.billingMonth, r.expectedAmount, r.paidAmount, r.pendingAmount, r.status]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
      const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payments-report.csv`
      a.click()
      URL.revokeObjectURL(url)
      return
    }
    const qs = tab === 'DAILY' ? `date=${applied.date}` : `month=${applied.month}`
    window.open(`/api/v1/reports/${type}.csv?${qs}`, '_blank')
  }

  const saveView = () => {
    localStorage.setItem('dsms-report-view', JSON.stringify({ tab, date, month, techFilter, supporterFilter, statusFilter, pageSize }))
    setSavedMsg('View saved on this device.')
    setTimeout(() => setSavedMsg(null), 2500)
  }

  const technologies = Array.from(new Set((daily.data?.rows ?? []).map((r) => r.technology).filter(Boolean) as string[])).sort()

  return (
    <div className="space-y-5 pb-2">
      <PageHeader
        title="Reports"
        subtitle="Review support activity, hours and team performance."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl border border-brand/40 text-brand bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft inline-flex items-center gap-2"
              onClick={saveView}
            >
              <Bookmark className="size-4" />
              Save view
            </button>
            <button
              type="button"
              className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark inline-flex items-center gap-2"
              onClick={exportCsv}
            >
              <Download className="size-4" />
              Export
              <ChevronDown className="size-3.5 opacity-80" />
            </button>
          </div>
        }
      />
      {savedMsg ? <p className="text-sm text-emerald-700">{savedMsg}</p> : null}

      <div className="flex flex-wrap gap-1 border-b border-line">
        {([
          ['DAILY', 'Daily Support'],
          ['CANDIDATE', 'Candidate Summary'],
          ['SUPPORTER', 'Supporter Hours'],
          ['PAYMENTS', 'Payments'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={cn(
              'px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition',
              tab === key ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-slate-700',
            )}
            onClick={() => { setTab(key); setPage(0); setTableQ('') }}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="dsms-card p-4 space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          {tab === 'DAILY' ? (
            <label className="text-sm font-medium">
              Report date
              <div className="mt-1.5 relative">
                <CalendarDays className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="date" className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm bg-white" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </label>
          ) : (
            <label className="text-sm font-medium">
              Report month
              <input type="month" className="mt-1.5 block rounded-xl border border-line px-3 py-2 text-sm bg-white" value={month} onChange={(e) => setMonth(e.target.value)} />
            </label>
          )}
          {tab === 'DAILY' ? (
            <>
              <label className="text-sm font-medium">
                Technology
                <select className="mt-1.5 block rounded-xl border border-line px-3 py-2 text-sm bg-white min-w-40" value={techFilter} onChange={(e) => setTechFilter(e.target.value)}>
                  <option value="">All technologies</option>
                  {technologies.map((t) => <option key={t} value={t}>{t}</option>)}
                  {(skills.data ?? []).filter((s) => !technologies.includes(s.name)).map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium">
                Supporter
                <select className="mt-1.5 block rounded-xl border border-line px-3 py-2 text-sm bg-white min-w-40" value={supporterFilter} onChange={(e) => setSupporterFilter(e.target.value)}>
                  <option value="">All supporters</option>
                  <option value="__UNASSIGNED__">Unassigned</option>
                  {(experts.data?.items ?? []).map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">
                Status
                <select className="mt-1.5 block rounded-xl border border-line px-3 py-2 text-sm bg-white min-w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All statuses</option>
                  {['PENDING', 'RUNNING', 'COMPLETED', 'MISSED', 'NO_SUPPORT_REQUIRED'].map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </label>
            </>
          ) : null}
          <button
            type="button"
            className="rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark inline-flex items-center gap-2"
            onClick={applyFilters}
          >
            <Filter className="size-4" />
            Apply filters
          </button>
          <button type="button" className="text-sm font-semibold text-brand hover:underline px-1 py-2" onClick={resetFilters}>
            Reset
          </button>
          <span className="ml-auto text-xs text-muted self-center">Timezone: IST (Asia/Kolkata)</span>
        </div>
        {tab === 'DAILY' ? (
          <div className="flex flex-wrap gap-2">
            {([
              ['TODAY', 'Today'],
              ['YESTERDAY', 'Yesterday'],
              ['WEEK', 'This week'],
              ['MONTH', 'This month'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold border',
                  quickRange === key ? 'bg-brand-soft text-brand border-brand/30' : 'bg-white text-muted border-line hover:bg-slate-50',
                )}
                onClick={() => setQuick(key)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title={metrics.labels[0]} value={metrics.a} tone="blue" icon={<Users className="size-5" />} />
        <MetricCard title={metrics.labels[1]} value={metrics.b} tone="green" icon={<CheckCircle2 className="size-5" />} />
        <MetricCard title={metrics.labels[2]} value={metrics.c} tone="orange" icon={<Clock3 className="size-5" />} />
        <MetricCard title={metrics.labels[3]} value={metrics.d} tone="violet" icon={<Timer className="size-5" />} />
      </div>

      <section className="dsms-card overflow-hidden">
        <header className="px-5 py-4 border-b border-line flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">
              {tab === 'DAILY' ? 'Daily Support Report'
                : tab === 'CANDIDATE' ? 'Candidate Summary Report'
                  : tab === 'SUPPORTER' ? 'Supporter Hours Report'
                    : 'Payments Report'}
            </h2>
            <span className="dsms-chip bg-sky-100 text-sky-800">Preview data</span>
            <span className="text-xs text-muted">
              {tab === 'DAILY' ? `${dateLabel} • ${dailyRows.length} candidates` : `${activeRows.length} rows`}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="rounded-xl border border-line pl-10 pr-3 py-2 text-sm w-52 bg-white"
                placeholder="Search in report..."
                value={tableQ}
                onChange={(e) => { setTableQ(e.target.value); setPage(0) }}
              />
            </div>
            <button type="button" className="rounded-xl border border-line px-3 py-2 text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-2">
              <Columns3 className="size-4" />
              Columns
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          {tab === 'DAILY' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Candidate / Group', 'Technology', 'Supporter', 'Status', 'Duration', 'Links', 'Details'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(paged as DailyRow[]).length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={7}>{daily.isLoading ? 'Loading report…' : 'No rows for this filter.'}</td></tr>
                ) : (paged as DailyRow[]).map((r) => (
                  <tr key={r.candidateId} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-3">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(r.candidateName))}>
                          {initials(r.candidateName)}
                        </span>
                        <span>
                          <span className="font-semibold block text-slate-800">{r.candidateName}</span>
                          <span className="text-xs text-muted">{r.groupName || 'No group'}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('dsms-chip', techTone(r.technology || 'Other'))}>{r.technology || 'Other'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {r.supporterName ? (
                        <div className="inline-flex items-center gap-2">
                          <span className={cn('size-7 rounded-full grid place-items-center text-[10px] font-bold', avatarTone(r.supporterName))}>
                            {initials(r.supporterName)}
                          </span>
                          <span>{r.supporterName}</span>
                        </div>
                      ) : <span className="text-muted">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('dsms-chip inline-flex items-center gap-1.5', statusTone(r.dayStatus))}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {statusLabel(r.dayStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted">
                      {r.duration && r.duration !== '0h 00m' ? r.duration : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-1.5">
                        {r.whatsappGroupLink ? (
                          <a href={r.whatsappGroupLink} target="_blank" rel="noreferrer" className="size-8 rounded-lg bg-[#25D366]/15 ring-1 ring-[#25D366]/40 grid place-items-center" title="WhatsApp">
                            <WhatsAppIcon className="size-[18px]" />
                          </a>
                        ) : (
                          <span className="size-8 rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center"><WhatsAppIcon className="size-[18px] opacity-35 grayscale" /></span>
                        )}
                        {meetingPlatform(r.meetingUrl) === 'ZOOM' && r.meetingUrl ? (
                          <a href={r.meetingUrl} target="_blank" rel="noreferrer" className="size-8 rounded-lg bg-[#2D8CFF]/15 ring-1 ring-[#2D8CFF]/50 grid place-items-center" title="Zoom">
                            <ZoomIcon className="size-4" />
                          </a>
                        ) : (
                          <span className="size-8 rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center"><ZoomIcon className="size-4 opacity-35 grayscale" /></span>
                        )}
                        {meetingPlatform(r.meetingUrl) === 'GOOGLE_MEET' && r.meetingUrl ? (
                          <a href={r.meetingUrl} target="_blank" rel="noreferrer" className="size-8 rounded-lg bg-emerald-50 ring-1 ring-emerald-300 grid place-items-center" title="Google Meet">
                            <GoogleMeetIcon className="size-4" />
                          </a>
                        ) : (
                          <span className="size-8 rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center"><GoogleMeetIcon className="size-4 opacity-35 grayscale" /></span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        className="size-8 rounded-lg border border-line grid place-items-center hover:bg-slate-50"
                        onClick={() => navigate(`/candidates/${r.candidateId}`)}
                        title="Open candidate"
                      >
                        <ChevronRight className="size-4 text-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === 'CANDIDATE' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Candidate / Group', 'Status', 'Sessions', 'Duration', 'Details'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(paged as Array<Record<string, unknown>>).length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={5}>No candidate summary rows.</td></tr>
                ) : (paged as Array<Record<string, unknown>>).map((r) => (
                  <tr key={String(r.candidateId)} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-3">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(String(r.candidate)))}>{initials(String(r.candidate))}</span>
                        <span>
                          <span className="font-semibold block">{String(r.candidate)}</span>
                          <span className="text-xs text-muted">{String(r.group || '—')}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className={cn('dsms-chip', statusTone(String(r.status)))}>{statusLabel(String(r.status))}</span></td>
                    <td className="px-4 py-3.5 font-semibold">{String(r.sessions ?? 0)}</td>
                    <td className="px-4 py-3.5 font-semibold">{String(r.duration ?? '0h 00m')}</td>
                    <td className="px-4 py-3.5">
                      <button type="button" className="size-8 rounded-lg border border-line grid place-items-center" onClick={() => navigate(`/candidates/${r.candidateId}`)}>
                        <ChevronRight className="size-4 text-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === 'SUPPORTER' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Supporter', 'Status', 'Month hours', 'Details'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(paged as Array<Record<string, unknown>>).length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={4}>No supporter hours rows.</td></tr>
                ) : (paged as Array<Record<string, unknown>>).map((r) => (
                  <tr key={String(r.id)} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-3">
                        <span className={cn('size-9 rounded-full grid place-items-center text-[11px] font-bold', avatarTone(String(r.name)))}>{initials(String(r.name))}</span>
                        <span className="font-semibold">{String(r.name)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className={cn('dsms-chip', statusTone(String(r.status)))}>{statusLabel(String(r.status))}</span></td>
                    <td className="px-4 py-3.5 font-semibold">{formatHoursMinutes(Number(r.monthSeconds ?? 0))}</td>
                    <td className="px-4 py-3.5">
                      <button type="button" className="size-8 rounded-lg border border-line grid place-items-center" onClick={() => navigate(`/experts/${r.id}`)}>
                        <ChevronRight className="size-4 text-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === 'PAYMENTS' ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Billing month', 'Expected', 'Paid', 'Pending', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(paged as CandidatePayment[]).length === 0 ? (
                  <tr><td className="px-5 py-8 text-muted" colSpan={5}>No payment records.</td></tr>
                ) : (paged as CandidatePayment[]).map((r) => (
                  <tr key={r.id} className="border-t border-line hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 font-semibold">{r.billingMonth}</td>
                    <td className="px-4 py-3.5">₹{Number(r.expectedAmount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5">₹{Number(r.paidAmount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5">₹{Number(r.pendingAmount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5"><span className={cn('dsms-chip', statusTone(r.status))}>{statusLabel(r.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>

        <footer className="px-5 py-3 border-t border-line flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <span>
            Showing {activeRows.length === 0 ? 0 : safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, activeRows.length)} of {activeRows.length}
            {tab === 'DAILY' ? ' candidates' : ' rows'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border border-line px-2 py-1.5 text-sm bg-white"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }}
            >
              {[8, 12, 20, 50].map((n) => <option key={n} value={n}>{n} per page</option>)}
            </select>
            <button type="button" className="rounded-lg border border-line px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, i) => i).slice(0, 5).map((i) => (
              <button
                key={i}
                type="button"
                className={cn('size-8 rounded-lg border text-sm font-semibold', safePage === i ? 'bg-brand text-white border-brand' : 'border-line hover:bg-slate-50')}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" className="rounded-lg border border-line px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
              Next
            </button>
          </div>
        </footer>
      </section>

      <section className="rounded-2xl border border-brand/20 bg-brand-soft/40 px-4 py-3 grid sm:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
        <div className="inline-flex items-start gap-2 text-slate-700">
          <Info className="size-4 text-brand mt-0.5" />
          <span><strong className="font-semibold">Report tools</strong><br /><span className="text-muted text-xs">Use tabs and filters for quick analysis.</span></span>
        </div>
        <div className="inline-flex items-start gap-2 text-slate-700">
          <Bookmark className="size-4 text-brand mt-0.5" />
          <span><strong className="font-semibold">Save filter views</strong><br /><span className="text-muted text-xs">Store frequently used filters on this device.</span></span>
        </div>
        <div className="inline-flex items-start gap-2 text-slate-700">
          <Download className="size-4 text-brand mt-0.5" />
          <span><strong className="font-semibold">Export CSV / Excel / PDF</strong><br /><span className="text-muted text-xs">Download the current report as CSV.</span></span>
        </div>
        <div className="inline-flex items-start gap-2 text-slate-700">
          <ChevronRight className="size-4 text-brand mt-0.5" />
          <span><strong className="font-semibold">Open candidate details</strong><br /><span className="text-muted text-xs">Use the row chevron to open profiles.</span></span>
        </div>
      </section>
    </div>
  )
}

export function AuditPage() {
  const q = useQuery({
    queryKey: ['audit'],
    queryFn: () => api<Array<{ id: string; action: string; resourceType: string; resourceId: string; createdOn: string }>>('/api/v1/audit-events'),
  })
  return <ResourceTable title="Audit trail" rows={q.data} columns={[
    { key: 'createdOn', label: 'When' },
    { key: 'action', label: 'Action' },
    { key: 'resourceType', label: 'Resource' },
    { key: 'resourceId', label: 'Id' },
  ]} />
}

export function RequestsPage() {
  const engagements = useQuery({ queryKey: ['engagements'], queryFn: () => api<PageResponse<Engagement>>('/api/v1/engagements') })
  const engagementId = engagements.data?.items[0]?.id
  const q = useQuery({
    queryKey: ['requests', engagementId],
    enabled: Boolean(engagementId),
    queryFn: () => api<Array<{ id: string; displayCode: string; title: string; status: string }>>(`/api/v1/support-requests?engagementId=${engagementId}`),
  })
  return <ResourceTable title="Support requests" rows={q.data} columns={[{ key: 'displayCode', label: 'Code' }, { key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }]} />
}

export function InvoicesPage() {
  const q = useQuery({ queryKey: ['invoices'], queryFn: () => api<Invoice[]>('/api/v1/invoices') })
  return <ResourceTable title="Invoices" rows={q.data} columns={[{ key: 'invoiceNumber', label: 'Number' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }, { key: 'paymentStatus', label: 'Payment' }]} />
}

export function PayoutsPage() {
  const q = useQuery({ queryKey: ['payouts'], queryFn: () => api<Payout[]>('/api/v1/payout-statements') })
  return <ResourceTable title="Payout statements" rows={q.data} columns={[{ key: 'statementNumber', label: 'Number' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }, { key: 'paidAmount', label: 'Paid' }]} />
}

export function UsersPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const q = useQuery({
    queryKey: ['users'],
    queryFn: () => api<PageResponse<{ id: string; email: string; displayName: string; role: string; status: string }>>('/api/v1/users'),
  })
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('COORDINATOR')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['users'] })
  const invite = useMutation({
    mutationFn: () => api<{ temporaryPassword?: string | null }>('/api/v1/users/invite', {
      method: 'POST',
      body: JSON.stringify({ email, displayName, role }),
    }),
    onSuccess: (created) => {
      setEmail('')
      setDisplayName('')
      setMessage(created.temporaryPassword
        ? `User created as ACTIVE. One-time password: ${created.temporaryPassword}`
        : 'User invited.')
      setError(null)
      refresh()
    },
    onError: (err: Error) => { setError(err.message); setMessage(null) },
  })
  const changeRole = useMutation({
    mutationFn: ({ id, nextRole }: { id: string; nextRole: string }) =>
      api(`/api/v1/users/${id}/role`, { method: 'POST', body: JSON.stringify({ role: nextRole }) }),
    onSuccess: () => { setMessage('Role updated'); setError(null); refresh() },
    onError: (err: Error) => { setError(err.message); setMessage(null) },
  })
  const setStatus = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'activate' | 'suspend' }) =>
      api(`/api/v1/users/${id}/${action}`, { method: 'POST' }),
    onSuccess: () => { setMessage('User status updated'); setError(null); refresh() },
    onError: (err: Error) => { setError(err.message); setMessage(null) },
  })
  if (user?.role !== 'ADMIN') {
    return <div className="space-y-2"><h2 className="text-lg font-semibold">Users</h2><p className="text-sm text-slate-600">Only admins can manage users.</p></div>
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Users & permissions</h2>
      </div>
      <form className="bg-white rounded-lg p-4 shadow-sm space-y-3 max-w-xl" onSubmit={(e) => { e.preventDefault(); invite.mutate() }}>
        <h3 className="font-medium">Invite staff or user</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">Email<input type="email" className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="block text-sm">Display name<input className="mt-1 w-full border rounded px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required /></label>
          <label className="block text-sm">Role
            <select className="mt-1 w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="COORDINATOR">Coordinator</option>
              <option value="ADMIN">Admin</option>
              <option value="CANDIDATE">Candidate</option>
              <option value="EXPERT">Expert / Supporter</option>
            </select>
          </label>
        </div>
        <button className="bg-brand text-white rounded px-4 py-2" disabled={invite.isPending}>{invite.isPending ? 'Inviting…' : 'Invite user'}</button>
      </form>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600 break-words">{error}</p> : null}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(q.data?.items ?? []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.displayName}</td>
                <td className="px-4 py-3">
                  <select className="border rounded px-2 py-1" value={row.role} disabled={row.id === user.id} onChange={(e) => changeRole.mutate({ id: row.id, nextRole: e.target.value })}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="COORDINATOR">COORDINATOR</option>
                    <option value="CANDIDATE">CANDIDATE</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                  {row.status !== 'ACTIVE' ? <button className="text-brand underline" onClick={() => setStatus.mutate({ id: row.id, action: 'activate' })}>Activate</button> : null}
                  {row.status !== 'SUSPENDED' && row.id !== user.id ? <button className="text-red-600 underline" onClick={() => setStatus.mutate({ id: row.id, action: 'suspend' })}>Suspend</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SettingsPage() {
  const skills = useQuery({ queryKey: ['skills'], queryFn: () => api<Skill[]>('/api/v1/skills') })
  const q = useQuery({ queryKey: ['settings'], queryFn: () => api<Array<{ key: string; value: string; type: string }>>('/api/v1/settings') })
  return (
    <div className="space-y-4">
      <ResourceTable title="Technologies" rows={skills.data} columns={[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }]} />
      <ResourceTable title="Settings" rows={(q.data ?? []).map((s) => ({ id: s.key, ...s }))} columns={[{ key: 'key', label: 'Key' }, { key: 'value', label: 'Value' }, { key: 'type', label: 'Type' }]} />
    </div>
  )
}

export function NotificationsPage() {
  const q = useQuery({ queryKey: ['notifications'], queryFn: () => api<NotificationItem[]>('/api/v1/notifications') })
  return <ResourceTable title="Notifications" rows={q.data} columns={[{ key: 'title', label: 'Title' }, { key: 'body', label: 'Body' }, { key: 'createdOn', label: 'When' }]} />
}

export function WorkPage() {
  const active = useQuery({ queryKey: ['active-timer'], queryFn: () => api<WorkEntry>('/api/v1/work-entries/active'), refetchInterval: 1000 })
  const engagements = useQuery({ queryKey: ['engagements'], queryFn: () => api<PageResponse<Engagement>>('/api/v1/engagements') })
  const [engagementId, setEngagementId] = useState(engagements.data?.items[0]?.id ?? '')
  const [workDone, setWorkDone] = useState('')
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">My Work</h2>
      <p className="text-sm text-slate-600">The browser clock is display-only. Start/Pause/Resume/Stop are confirmed only after the server responds.</p>
      <div className="bg-white p-4 rounded-lg space-y-3">
        <select className="border rounded px-3 py-2" value={engagementId} onChange={(e) => setEngagementId(e.target.value)}>
          <option value="">Select engagement</option>
          {(engagements.data?.items ?? []).map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand text-white px-3 py-2 rounded" onClick={() => api('/api/v1/work-entries/start', { method: 'POST', body: JSON.stringify({ engagementId, category: 'MEETING' }), headers: { 'Idempotency-Key': crypto.randomUUID() } }).then(() => active.refetch())}>Start</button>
          <button className="border px-3 py-2 rounded" onClick={() => active.data?.id && api(`/api/v1/work-entries/${active.data.id}/pause`, { method: 'POST' }).then(() => active.refetch())}>Pause</button>
          <button className="border px-3 py-2 rounded" onClick={() => active.data?.id && api(`/api/v1/work-entries/${active.data.id}/resume`, { method: 'POST' }).then(() => active.refetch())}>Resume</button>
          <button className="border px-3 py-2 rounded" onClick={() => active.data?.id && api(`/api/v1/work-entries/${active.data.id}/stop`, { method: 'POST', body: JSON.stringify({ workDone, issueTopic: 'Support', remarks: '' }) }).then(() => active.refetch())}>End support</button>
        </div>
        <label className="block text-sm">Work done / remarks
          <textarea className="mt-1 w-full border rounded px-3 py-2" value={workDone} onChange={(e) => setWorkDone(e.target.value)} />
        </label>
        <p>State: {active.data?.timerState ?? 'none'} · {active.data?.recordedSeconds ?? 0}s · {active.data?.candidateName ?? ''}</p>
      </div>
    </div>
  )
}
