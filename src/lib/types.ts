export type CurrentUser = {
  id: string
  email: string
  displayName: string
  role: 'ADMIN' | 'COORDINATOR' | 'CANDIDATE' | 'EXPERT'
  status: string
  timezone: string
  mustChangePassword: boolean
}

export type PageResponse<T> = {
  items: T[]
  totalElements: number
  page: number
  size: number
}

export type Candidate = {
  id: string
  displayCode: string
  fullName: string
  status: string
  coordinatorUserId: string | null
  consultancyName?: string | null
  employerLabel?: string | null
  whatsappGroupName?: string | null
  whatsappGroupLink?: string | null
  technology?: string | null
  technologies?: string[]
  skillIds?: string[]
  primarySupporterName?: string | null
  supportStartDate?: string | null
  thisMonthHours?: string | null
  phone?: string | null
  email?: string | null
  primarySkillId?: string | null
}

export type Expert = {
  id: string
  displayCode: string
  fullName: string
  status: string
  hourlyPayoutRate: string | null
  primaryTechnology?: string | null
  technologies?: string[]
  skills?: Array<{ skillId: string; skillName: string | null; proficiency: string | null }>
  workingTime?: string | null
  activeCandidateCount?: number
  todayHours?: string | null
  monthHours?: string | null
  paymentType?: string | null
  phone?: string | null
  email?: string | null
}

export type Skill = {
  id: string
  name: string
  status: string
}

export type Engagement = {
  id: string
  displayCode: string
  title: string
  candidateId: string
  candidateName?: string | null
  groupName?: string | null
  startDate?: string | null
  endDate?: string | null
  status: string
  planType: string | null
  defaultMeetingUrl: string | null
  candidateFee?: string | null
  supporterRate?: string | null
  primaryExpertId?: string | null
  primaryExpertName?: string | null
  thisMonthHours?: string | null
}

export type Assignment = {
  id: string
  engagementId: string
  expertId: string
  acceptanceState: string
  effectiveStart: string
}

export type Session = {
  id: string
  displayCode: string
  scheduledStart: string
  scheduledEnd: string
  status: string
  topic: string | null
  meetingUrl: string | null
}

export type WorkEntry = {
  id: string | null
  displayCode: string | null
  engagementId: string | null
  candidateId?: string | null
  candidateName?: string | null
  expertId?: string | null
  expertName?: string | null
  groupName?: string | null
  workDate?: string | null
  startedOn?: string | null
  endedOn?: string | null
  timerState: string | null
  recordedSeconds: number
  serverNowEpochMilli: number
  currentSegmentStartEpochMilli: number | null
  reviewStatus: string | null
  sharedSummary: string | null
}

export type DailySheet = {
  date: string
  summary: {
    active: number
    supported: number
    running: number
    pending: number
    missed: number
    noSupport: number
    totalHours: string
  }
  rows: Array<{
    candidateId: string
    candidateName: string
    groupName: string | null
    technology: string | null
    supporterId: string | null
    supporterName: string | null
    engagementId: string | null
    start: string | null
    end: string | null
    duration: string
    dayStatus: string
    whatsappGroupLink: string | null
    meetingUrl: string | null
    workEntryId: string | null
    notes?: string | null
  }>
}

export type CandidatePayment = {
  id: string
  candidateId: string
  candidateName?: string | null
  candidateDisplayCode?: string | null
  groupName?: string | null
  billingMonth: string
  expectedAmount: string
  paidAmount: string
  pendingAmount: string
  dueDate: string | null
  paymentDate: string | null
  method: string | null
  externalReference?: string | null
  notes?: string | null
  status: string
}

export type SupporterPayment = {
  id: string
  expertId: string
  expertName?: string | null
  expertDisplayCode?: string | null
  groupName?: string | null
  billingMonth: string
  paymentModel: string
  calculationLabel?: string | null
  approvedHours?: string | null
  hourlyRate?: string | null
  baseAmount: string
  adjustmentAmount: string
  adjustmentReason?: string | null
  finalPayable: string
  amountPaid: string
  balanceAmount?: string | null
  notes?: string | null
  status: string
}

export type Invoice = {
  id: string
  invoiceNumber: string
  status: string
  total: string
  collectedAmount: string
  outstanding: string
  paymentStatus: string
}

export type Payout = {
  id: string
  statementNumber: string
  status: string
  total: string
  paidAmount: string
}

export type NotificationItem = {
  id: string
  title: string
  body: string
  read: boolean
  createdOn: string
}
