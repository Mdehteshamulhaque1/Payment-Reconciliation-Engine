import { create } from 'zustand'

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,
  
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction]
    })),
  
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      )
    })),
  
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    })),
}))

export const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  logout: () => set({ user: null }),
}))
