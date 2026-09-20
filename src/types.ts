export type RfiStatus = 'AWAITING_RESPONSE' | 'DRAFT_READY' | 'UNDER_REVIEW' | 'RESOLVED';
export type RfiPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RfiItem {
  id: string; // e.g. RFI-2024-089
  submittedTime: string; // e.g. "Submitted 2d ago"
  title: string;
  description: string;
  fullQuery?: string;
  client: string;
  project: string;
  assignedLead: {
    name: string;
    initials: string;
    avatarColor?: string;
    role?: string;
  };
  status: RfiStatus;
  statusLabel: string;
  priority: RfiPriority;
  csiDivision?: string;
  deltaCost?: number;
  deltaTonnage?: number;
  resolvedNote?: string;
  linkedBidId?: string;
  bimOverlayAvailable?: boolean;
}

export interface BidItem {
  id: string; // e.g. BID-8849
  title: string;
  divisionScope?: string;
  client: string;
  amount: number;
  dueDate: string;
  winProbability: {
    percent: number;
    label: string;
    level: 'High' | 'Moderate' | 'Strong' | 'Low';
  };
  takeoffProgress: number;
  rfiBlocker?: string;
  specValidated?: boolean;
  estimator?: string;
  status: 'active' | 'submitted' | 'under_review' | 'awarded';
}

export interface ClientItem {
  id: string;
  initials: string;
  name: string;
  agreementTier: string;
  division: string;
  lifetimeValue: number;
  activeProjectsCount: number;
  activeProjectsLabel: string;
  invoicedAmount: number;
  paidAmount: number;
  paidPercent: number;
  contact: {
    initials: string;
    name: string;
    title: string;
    phone?: string;
    email?: string;
  };
}

export interface MetricSummary {
  pipelineTotal: number;
  pipelineMom: number;
  submittedEstimatesCount: number;
  activeClientsCount: number;
  tier1Count: number;
  masterContractsCount: number;
  retainedPercent: number;
  openRfiCount: number;
  slaMaxHours: number;
  avgTurnHours: number;
  overdueRiskCount: number;
  winRatePercent: number;
  winRateBenchmarkDelta: number;
  bidsTrackedCount: number;
}

export type ProjectTrackStatus =
  | 'ACTIVE_TAKEOFF'
  | 'BIM_MODELING'
  | 'CRITICAL_RFI_BLOCK'
  | 'QUALITY_AUDIT'
  | 'DELIVERED';

export interface MilestoneItem {
  id: string;
  title: string;
  status: 'complete' | 'in_progress' | 'pending';
  note?: string;
}

export interface ProjectTrackItem {
  id: string; // e.g. BID-2024-884
  title: string;
  gc: string;
  scopeType: string;
  status: ProjectTrackStatus;
  statusLabel: string;
  statusColor?: string;
  estimateValue: number;
  completionPace: number;
  targetDue: string;
  daysRemaining?: number; // e.g. -3 (overdue), 0 (today), 1 (1 day left), 2 (2 days left), etc.
  budgetedHours?: number; // e.g. 160
  priority?: 'CRITICAL' | 'HIGH' | 'NORMAL';
  paceStatus: string;
  paceStatusType: 'success' | 'info' | 'warning' | 'audit';
  milestones: MilestoneItem[];
  notice?: {
    type: 'linked_rfi' | 'info' | 'critical_hold' | 'audit_signoff';
    text: string;
    subtext?: string;
    highlightAmount?: string;
    rfiCode?: string;
  };
  leadEstimators: Array<{
    name: string;
    initials: string;
    avatarUrl?: string;
    avatarColor?: string;
  }>;
  leadRole: string;
  actionType: 'inspect' | 'escalate' | 'release';
  actionLabel: string;
  qtoSpecs?: string[];
  totalHoursLogged?: number;
  createdDate?: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  counterparty: string;
  type: 'inflow' | 'outflow';
  amount: number;
  status: 'reconciled' | 'pending' | 'cleared';
  paymentMethod: string;
  account: string;
  referenceNumber?: string;
}

export interface EmployeeItem {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: 'Pre-Construction' | 'VDC & BIM' | 'Estimating Operations' | 'Finance & Legal' | 'Executive Leadership' | 'Client Relations';
  type: 'Full-Time W-2' | 'Part-Time W-2' | 'Contractor 1099';
  annualSalary: number;
  monthlyGross: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    ficaMedicare: number;
    retirement401k: number;
    healthInsurance: number;
  };
  netPay: number;
  hireDate: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Probation';
  directDeposit: string;
  ptoDaysRemaining: number;
  performanceRating: number;
  manager: string;
}

export interface PayrollRunItem {
  id: string;
  period: string;
  payDate: string;
  totalGross: number;
  totalTaxesWithheld: number;
  totalDeductions: number;
  totalNetPaid: number;
  employeeCount: number;
  status: 'Paid' | 'Processing' | 'Scheduled';
}

export interface LoanItem {
  id: string;
  name: string;
  lender: string;
  type: 'Line of Credit' | 'SBA 7(a) Term' | 'Equipment Lease' | 'Founder Bridge' | 'Working Capital';
  principalAmount: number;
  currentBalance: number;
  interestRate: number; // in percentage, e.g. 6.5
  monthlyPayment: number;
  originationDate: string;
  maturityDate: string;
  nextPaymentDue: string;
  autoPay: boolean;
  status: 'Active' | 'Paid Off';
  notes?: string;
}

export interface LoanPaymentRecord {
  id: string;
  loanId: string;
  loanName: string;
  date: string;
  amount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  method: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  initials: string;
  role: string;
  equityPercent: number;
  profitSharePercent: number;
  capitalContributed: number;
  currentCapitalBalance: number;
  totalPayoutsYtd: number;
  pendingDistribution: number;
  taxIdMask: string;
  bankRoutingMask: string;
  email: string;
}

export interface PartnerPayoutRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  date: string;
  amount: number;
  payoutType: 'Quarterly Profit Share' | 'Tax Distribution' | 'Guaranteed Payment' | 'Partner Draw';
  paymentMethod: string;
  status: 'Completed' | 'Pending Approval' | 'Processing';
  referenceCode: string;
  notes?: string;
}

export interface EmergencyFundAllocation {
  asset: string;
  amount: number;
  share: number;
  apy: string;
  institution: string;
}

export interface EmergencyFundHistoryItem {
  id: string;
  date: string;
  type: 'Deposit' | 'Drawdown' | 'Yield' | 'Sweep';
  amount: number;
  description: string;
  balanceAfter: number;
}

export interface EmergencyFundState {
  currentBalance: number;
  targetBalance: number;
  targetAmount: number;
  monthlyBurnRate: number;
  runwayMonths: number;
  apyRate: number; // e.g. 4.85
  autoSweepPercent: number; // e.g. 10%
  monthlyAccruedInterest: number;
  vaultInstitution: string;
  accountNumberMask: string;
  allocations: EmergencyFundAllocation[];
  history: EmergencyFundHistoryItem[];
}

export interface EmergencyFundTransaction {
  id: string;
  date: string;
  type: 'deposit' | 'sweep' | 'yield' | 'emergency_drawdown';
  amount: number;
  description: string;
  authorizedBy: string;
  balanceAfter: number;
}

export interface EstimatorWorkloadItem {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  initials: string;
  avatarColor?: string;
  activeAssignments: string[];
  committedHours: number;
  maxWeeklyHours?: number; // Standard is 40h/week
  capacityLoadPercent: number; // Utilization rate %
  roleCategory?: 'principal' | 'senior' | 'bim_vdc' | 'structural' | 'mep' | 'general';
  projectAllocations?: Array<{
    projectId: string;
    projectTitle: string;
    hoursPerWeek: number;
    roleOnProject?: string;
  }>;
  signOffStatus: {
    text: string;
    type: 'cleared' | 'progress' | 'blocked';
    note?: string;
  };
}

export interface ArchivedDeliverableItem {
  id: string;
  packageCode: string;
  packageName: string;
  scopeSummary: string;
  gc: string;
  deliveredDate: string;
  contractValue: number;
  budgetStatus: string;
  auditVerification: {
    status: string;
    signers: string;
  };
  fileSize: string;
}

