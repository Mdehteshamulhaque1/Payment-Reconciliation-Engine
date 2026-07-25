import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { Button } from './Button'
import type { DataTableProps } from '@/types'

export function DataTable<T extends { id?: number | string }>({
  data, columns, loading, emptyMessage = 'No data found', emptyIcon,
  pagination, onRowClick, expandable,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [expandedRow, setExpandedRow] = useState<number | string | null>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = (a as Record<string, unknown>)[sortKey]
    const bVal = (b as Record<string, unknown>)[sortKey]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === 'string' && typeof bVal === 'string')
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    if (typeof aVal === 'number' && typeof bVal === 'number')
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    return 0
  })

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]">
        <EmptyState icon={emptyIcon ?? FileText} message={emptyMessage} />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-[var(--muted)] text-[11px] font-mono uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-[var(--accent-cyan)] transition-colors',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-[var(--muted)]/50">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {expandable && <th className="w-10 px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sorted.map((item, idx) => {
                const rowId = (item as Record<string, unknown>).id as number | string ?? idx
                const isExpanded = expandedRow === rowId
                return (
                  <motion.tr
                    key={rowId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      'border-b border-[color-mix(in_srgb,var(--accent-cyan)_5%,var(--border))] transition-all duration-200 last:border-0',
                      onRowClick && 'cursor-pointer hover:bg-[color-mix(in_srgb,var(--accent-cyan)_4%,transparent)]',
                    )}
                    onClick={() => {
                      if (onRowClick) onRowClick(item)
                      if (expandable) setExpandedRow(isExpanded ? null : rowId)
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3', col.className)}>
                        {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                    {expandable && (
                      <td className="px-4 py-3">
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={14} className="text-[var(--muted)]" />
                        </motion.div>
                      </td>
                    )}
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] px-4 py-3">
          <span className="text-xs text-[var(--muted)] font-mono">{pagination.total.toLocaleString()} results</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => pagination.onPageChange(pagination.page - 1)}>Prev</Button>
            {Array.from({ length: Math.min(pagination.pages, 5) }).map((_, i) => {
              let pageNum: number
              if (pagination.pages <= 5) pageNum = i + 1
              else if (pagination.page <= 3) pageNum = i + 1
              else if (pagination.page >= pagination.pages - 2) pageNum = pagination.pages - 4 + i
              else pageNum = pagination.page - 2 + i
              return (
                <Button key={pageNum} variant={pagination.page === pageNum ? 'primary' : 'outline'} size="sm" onClick={() => pagination.onPageChange(pageNum)}>
                  {pageNum}
                </Button>
              )
            })}
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => pagination.onPageChange(pagination.page + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
