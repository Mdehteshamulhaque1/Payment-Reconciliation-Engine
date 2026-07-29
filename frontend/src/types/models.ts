export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
  role: string | null
  created_at: string
}

export type TransactionStatus = 'created' | 'processing' | 'success' | 'failed' | 'pending' | 'cancelled' | 'refunded' | 'partially_refunded' | 'reconciled' | 'disputed'

export interface Transaction {
  id: number
  transaction_ref: string
  merchant_id: number | null
  customer_id: number | null
  gateway_id: number | null
  gateway_transaction_id: string | null
  amount: number
  currency: string
  status: TransactionStatus
  transaction_type: string
  description: string | null
  idempotency_key: string | null
  failure_reason: string | null
  retry_count: number
  created_at: string
  updated_at: string
  location: PaymentLocation | null
}

export interface Gateway {
  id: number
  name: string
  gateway_type: string
  display_name: string
  is_active: boolean
  sandbox_mode: boolean
}

export interface GatewayListResponse {
  gateways: Gateway[]
  available_simulators: string[]
}

export interface GatewaySimulateResponse {
  success: boolean
  gateway_name: string
  gateway_transaction_id: string
  status: string
  amount: number
  currency: string
  latency_ms: number
  error_message: string | null
}

export interface GatewayHealth {
  gateway_id: number
  status: string
  latency_ms: number | null
  uptime_pct: number | null
  last_checked: string | null
}

export interface Settlement {
  id: number
  transaction_id: number
  gateway_id: number | null
  amount: number
  currency: string
  status: string
  settlement_date: string | null
  batch_ref: string | null
  bank_ref: string | null
  fee: number
  net_amount: number
  created_at: string
}

export interface SettlementSummary {
  total: number
  count: number
  pending: number
  pending_count: number
  settled: number
  failed: number
  disputed_count: number
  total_amount: number
  total_settled: number
  total_fees: number
}

export interface LedgerEntry {
  id: number
  account: string
  account_name: string
  transaction_id: number
  entry_type: string
  type: string
  amount: number
  currency: string
  balance_after: number
  description: string | null
  reference: string | null
  created_at: string
}

export interface TrialBalanceEntry {
  account: string
  total_debit: number
  total_credit: number
  balance: number
}

export interface TrialBalance {
  entries: TrialBalanceEntry[]
  total_debit: number
  total_credits: number
  total_credit: number
  total_debits: number
  is_balanced: boolean
}

export interface ReconciliationResult {
  id: number
  transaction_id: number
  transaction_ref: string
  batch_id: string | null
  internal_status: string | null
  gateway_status: string | null
  settlement_status: string | null
  bank_status: string | null
  match_type: string | null
  discrepancy_type: string
  result_type: string
  type: string
  status: string
  confidence: number | null
  match_score: number | null
  is_resolved: boolean
  created_at: string
}

export interface ReconciliationSummary {
  total: number
  total_checked: number
  matched: number
  mismatches: number
  missing: number
  missing_internal: number
  missing_gateway: number
  duplicates: number
  accuracy_pct: number
  accuracy: number
}

export interface FraudCase {
  id: number
  transaction_id: number
  fraud_type: string
  risk_score: number
  ml_risk_score: number | null
  rule_risk_score: number | null
  model_contributions: string | null
  shap_explanation: string | null
  evidence_json: string | null
  reason: string
  description: string
  severity: string
  status: string
  assigned_to: number | null
  escalated: boolean
  tags: string | null
  resolution: string | null
  review_notes: string | null
  created_at: string
}

export interface FraudDashboard {
  total_cases: number
  open_cases: number
  investigating: number
  critical: number
  high: number
  medium: number
  low: number
  resolved: number
  confirmed_fraud: number
  false_positives: number
  avg_risk_score: number
  cases_last_24h: number
}

export interface FraudScanResponse {
  is_suspicious: boolean
  risk_score: number
  rule_risk_score: number
  ml_risk_score: number
  fraud_type: string | null
  factors: string[]
  case_id: number | null
  alert_id: number | null
  ml_explanation: Record<string, unknown> | null
  travel_check: Record<string, unknown> | null
  velocity_check: Record<string, unknown> | null
  behavioral_check: Record<string, unknown> | null
  graph_check: Record<string, unknown> | null
}

export interface FraudAlert {
  id: number
  transaction_id: number | null
  case_id: number | null
  alert_type: string
  severity: string
  status: string
  title: string
  description: string | null
  metadata_json: string | null
  is_read: boolean
  assigned_to: number | null
  created_at: string
  resolved_at: string | null
}

export interface MLDashboard {
  avg_ml_risk_score: number
  avg_rule_risk_score: number
  ml_case_count: number
  model_usage: Record<string, number>
  feature_importance: Record<string, number>
  fraud_rings: Array<{ customer_ids: number[]; shared_merchants: number[]; size: number; risk: number }>
  ml_enabled: boolean
}

export interface Notification {
  id: number
  channel: string
  subject: string
  body: string
  status: string
  is_read: boolean
  created_at: string
  read_at: string | null
}

export interface NotificationListResponse {
  items: Notification[]
  total: number
}

export interface ReconciliationListResponse {
  items: ReconciliationResult[]
  total: number
}

export interface Report {
  id: number
  name: string
  report_type: string
  format: string
  status: string
  file_path: string | null
  created_at: string
}

export interface ReportListResponse {
  items: Report[]
  total: number
}

export interface SettlementListResponse {
  items: Settlement[]
  settlements: Settlement[]
  total: number
}

export interface LedgerEntryListResponse {
  items: LedgerEntry[]
  total: number
}

export interface DashboardStats {
  total_transactions: number
  total_amount: number
  success_rate: number
  total_settlements: number
  pending_settlements: number
  reconciliation_accuracy: number
  fraud_cases: number
  active_gateways: number
}

export interface TransactionStats {
  total: number
  pending: number
  success: number
  failed: number
  refunded: number
  reconciled: number
  total_amount: number
  success_rate: number
}

export interface TopFailure {
  reason: string
  count: number
  percentage: number
}

export interface GatewayComparison {
  gateway_name: string
  total_transactions: number
  success_rate: number
  avg_latency_ms: number
  total_amount: number
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface PaymentLocation {
  id: number
  transaction_id: number
  sender_id: number | null
  receiver_id: number | null
  amount: number
  latitude: number
  longitude: number
  accuracy: number | null
  city: string | null
  state: string | null
  country: string | null
  full_address: string | null
  timezone: string | null
  ip_address: string | null
  device_info: string | null
  payment_timestamp: string | null
  location_capture_timestamp: string | null
  google_maps_url: string | null
  created_at: string
}

export interface SignupRequest {
  email: string
  password: string
  full_name: string
}
