import { useMutation } from '@tanstack/react-query'
import { checkoutApi, type TrialCheckoutRequest, type TrialCheckoutResponse } from '@/api/checkout'

export const checkoutKeys = {
  all: ['checkout'] as const,
}

export function useTrialCheckout() {
  return useMutation<TrialCheckoutResponse, Error, TrialCheckoutRequest>({
    mutationFn: (data) => checkoutApi.trial(data),
  })
}
