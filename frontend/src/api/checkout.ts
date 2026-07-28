import { api } from './client'

export interface TrialCheckoutRequest {
  plan: string
  gateway: string
  amount: number
  currency: string
}

export interface TrialCheckoutResponse {
  success: boolean
  transaction_id: number
  transaction_ref: string
  gateway: string
  gateway_transaction_id: string | null
  amount: number
  currency: string
  status: string
  message: string
}

export const checkoutApi = {
  trial: (data: TrialCheckoutRequest) => api.post<TrialCheckoutResponse>('/checkout/trial', data),
}
