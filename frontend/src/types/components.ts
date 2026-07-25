import { type ReactNode } from 'react'
import { type TransactionStatus } from './models'

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumb?: Array<{ label: string; href?: string }>
}

export interface StatusChipProps {
  status: TransactionStatus | string
  size?: 'sm' | 'md'
  pulse?: boolean
}

export interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string | number
  rawValue?: number
  change?: number
  color: string
  delay?: number
  isCurrency?: boolean
  sparklineData?: number[]
  onClick?: () => void
}

export interface DataTableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: React.ComponentType<{ size?: number; className?: string }>
  pagination?: {
    page: number
    pages: number
    total: number
    onPageChange: (page: number) => void
  }
  onRowClick?: (item: T) => void
  expandable?: {
    render: (item: T) => ReactNode
  }
}

export interface FilterTab {
  key: string
  label: string
  count?: number
}
