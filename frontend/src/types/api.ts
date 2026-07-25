export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

export interface PaginationParams {
  page?: number
  size?: number
}

export interface TransactionListParams extends PaginationParams {
  status?: string
  search?: string
}

export interface ReconciliationRunParams {
  type: string
}
