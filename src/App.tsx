import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { Protected } from './Protected'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage, ResetPasswordPage } from './pages/PasswordPages'
import {
  AssignmentsPage,
  AuditPage,
  CandidatePaymentsPage,
  CandidateProfilePage,
  CandidatesPage,
  DailySheetPage,
  DashboardPage,
  ExpertProfilePage,
  ExpertsPage,
  InvoicesPage,
  NotificationsPage,
  PayoutsPage,
  ReportsPage,
  RequestsPage,
  SessionsPage,
  SettingsPage,
  SupporterPaymentsPage,
  TimesheetsPage,
  UsersPage,
  WorkPage,
} from './pages/AppPages'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<Protected />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/daily-sheet" element={<DailySheetPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/candidates/:id" element={<CandidateProfilePage />} />
              <Route path="/experts" element={<ExpertsPage />} />
              <Route path="/experts/:id" element={<ExpertProfilePage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/timesheets" element={<TimesheetsPage />} />
              <Route path="/candidate-payments" element={<CandidatePaymentsPage />} />
              <Route path="/supporter-payments" element={<SupporterPaymentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/payouts" element={<PayoutsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/work" element={<WorkPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
