import type { ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  ClipboardList,
  FileBarChart2,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Receipt,
  Search,
  Settings,
  Shield,
  Timer,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from './lib/api'
import { useAuth } from './lib/auth'
import { cn, formatSeconds } from './lib/utils'
import type { WorkEntry } from './lib/types'
import type { LucideIcon } from 'lucide-react'

type NavItem = { to: string; label: string; icon: LucideIcon }
type NavGroup = { title: string; items: NavItem[] }

const adminNav: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/daily-sheet', label: 'Daily Sheet', icon: CalendarDays },
      { to: '/candidates', label: 'Candidates', icon: Users },
      { to: '/experts', label: 'Supporters', icon: UserPlus },
      { to: '/assignments', label: 'Activation', icon: ClipboardList },
    ],
  },
  {
    title: 'Tracking',
    items: [
      { to: '/sessions', label: 'Session History', icon: History },
      { to: '/timesheets', label: 'Timesheets', icon: Timer },
    ],
  },
  {
    title: 'Finance',
    items: [
      { to: '/candidate-payments', label: 'Candidate Payments', icon: Wallet },
      { to: '/supporter-payments', label: 'Supporter Payments', icon: Receipt },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/reports', label: 'Reports', icon: FileBarChart2 },
      { to: '/requests', label: 'Requests', icon: FileText },
      { to: '/users', label: 'Users', icon: Users },
      { to: '/settings', label: 'Settings', icon: Settings },
      { to: '/audit', label: 'Audit', icon: Shield },
    ],
  },
]

const coordinatorNav: NavGroup[] = adminNav.map((g) =>
  g.title === 'Administration'
    ? { ...g, items: g.items.filter((i) => !['/users', '/audit'].includes(i.to)) }
    : g,
)

const expertNav: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { to: '/', label: 'My Assignments', icon: LayoutDashboard },
      { to: '/daily-sheet', label: 'Daily Sheet', icon: CalendarDays },
      { to: '/work', label: 'My Work', icon: Timer },
    ],
  },
  {
    title: 'Tracking',
    items: [
      { to: '/sessions', label: 'Session History', icon: History },
      { to: '/timesheets', label: 'My Timesheets', icon: FileText },
    ],
  },
  {
    title: 'Finance',
    items: [{ to: '/supporter-payments', label: 'My Earnings', icon: Wallet }],
  },
]

const candidateNav: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { to: '/', label: 'My Support', icon: LayoutDashboard },
      { to: '/sessions', label: 'My Sessions', icon: History },
      { to: '/timesheets', label: 'Time to Review', icon: Timer },
      { to: '/requests', label: 'My Requests', icon: FileText },
      { to: '/invoices', label: 'My Invoices', icon: Receipt },
    ],
  },
]

const navByRole: Record<string, NavGroup[]> = {
  ADMIN: adminNav,
  COORDINATOR: coordinatorNav,
  EXPERT: expertNav,
  CANDIDATE: candidateNav,
}

const crumbMap: Record<string, { section: string; page: string }> = {
  '/': { section: 'Workspace', page: 'Dashboard' },
  '/daily-sheet': { section: 'Workspace', page: 'Daily Sheet' },
  '/candidates': { section: 'Workspace', page: 'Candidates' },
  '/experts': { section: 'Workspace', page: 'Supporters' },
  '/assignments': { section: 'Workspace', page: 'Activation' },
  '/sessions': { section: 'Tracking', page: 'Session History' },
  '/timesheets': { section: 'Tracking', page: 'Timesheets' },
  '/candidate-payments': { section: 'Finance', page: 'Candidate Payments' },
  '/supporter-payments': { section: 'Finance', page: 'Supporter Payments' },
  '/reports': { section: 'Administration', page: 'Reports' },
  '/requests': { section: 'Administration', page: 'Requests' },
  '/users': { section: 'Administration', page: 'Users' },
  '/settings': { section: 'Administration', page: 'Settings' },
  '/audit': { section: 'Administration', page: 'Audit' },
  '/notifications': { section: 'Workspace', page: 'Notifications' },
  '/work': { section: 'Workspace', page: 'My Work' },
  '/invoices': { section: 'Finance', page: 'Invoices' },
}

function initials(name?: string) {
  if (!name) return 'SA'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const groups = navByRole[user?.role ?? 'ADMIN'] ?? adminNav
  const basePath = '/' + (location.pathname.split('/')[1] ?? '')
  const crumb = crumbMap[location.pathname] ?? crumbMap[basePath === '/' ? '/' : basePath] ?? {
    section: 'Workspace',
    page: 'DSMS',
  }

  const timer = useQuery({
    queryKey: ['active-timer'],
    queryFn: () => api<WorkEntry>('/api/v1/work-entries/active'),
    enabled: user?.role === 'EXPERT',
    refetchInterval: 5000,
  })
  const unread = useQuery({
    queryKey: ['unread'],
    queryFn: () => api<{ count: number }>('/api/v1/notifications/unread-count'),
  })

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-canvas text-ink">
      <aside className="bg-sidebar text-white flex flex-col min-h-screen">
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-brand grid place-items-center font-extrabold tracking-tight shadow-lg shadow-teal-900/30">
            D
          </div>
          <div>
            <p className="font-extrabold tracking-wide leading-none">DSMS</p>
            <p className="text-[11px] text-sidebar-muted mt-1">Support Operations</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                          isActive
                            ? 'bg-brand text-white font-semibold shadow-md shadow-teal-950/20'
                            : 'text-teal-50/80 hover:bg-sidebar-hover hover:text-white',
                        )
                      }
                    >
                      <Icon className="size-4 shrink-0 opacity-90" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-brand/30 border border-white/20 grid place-items-center text-sm font-bold">
              {initials(user?.displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.displayName}</p>
              <p className="text-[11px] text-sidebar-muted truncate">{user?.role}</p>
            </div>
            <button
              className="size-9 rounded-lg hover:bg-sidebar-hover grid place-items-center text-sidebar-muted hover:text-white"
              title="Sign out"
              onClick={async () => {
                await logout()
                navigate('/login')
              }}
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col min-w-0 min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur border-b border-line px-6 flex items-center gap-4">
          <div className="text-sm text-muted whitespace-nowrap">
            <span>{crumb.section}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-ink">{crumb.page}</span>
          </div>
          <div className="flex-1 max-w-xl mx-auto relative">
            <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full rounded-full border border-line bg-slate-50 pl-10 pr-4 py-2 text-sm placeholder:text-slate-400 focus:bg-white"
              placeholder="Search candidates, supporters..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = (e.target as HTMLInputElement).value.trim()
                  navigate(q ? `/candidates?q=${encodeURIComponent(q)}` : '/candidates')
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative size-10 rounded-full border border-line bg-white grid place-items-center hover:bg-slate-50"
              aria-label="Notifications"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="size-4 text-slate-600" />
              {(unread.data?.count ?? 0) > 0 ? (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500" />
              ) : null}
            </button>
            <div className="size-10 rounded-full bg-brand text-white grid place-items-center text-sm font-bold">
              {initials(user?.displayName)}
            </div>
          </div>
        </header>

        {user?.role === 'EXPERT' && timer.data?.timerState && timer.data.timerState !== 'STOPPED' ? (
          <div className="bg-brand text-white px-6 py-2.5 text-sm flex items-center gap-4">
            <Timer className="size-4" />
            <span>Timer {timer.data.timerState}</span>
            <strong>{formatSeconds(timer.data.recordedSeconds)}</strong>
            <span className="opacity-90">Server clock is authoritative.</span>
          </div>
        ) : null}

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

        <footer className="h-11 border-t border-line bg-white px-6 flex items-center justify-between text-xs text-muted">
          <span>DSMS • Support Operations</span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-ok" />
            All changes saved.
          </span>
        </footer>
      </div>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle ? <p className="text-sm text-muted mt-1">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function AttentionBanner({ children }: { children: ReactNode }) {
  return (
    <div className="dsms-card p-4 border-amber-200 bg-amber-50/60 flex gap-3">
      <div className="size-9 rounded-full bg-amber-100 text-amber-700 grid place-items-center shrink-0">
        <AlertTriangle className="size-4" />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
