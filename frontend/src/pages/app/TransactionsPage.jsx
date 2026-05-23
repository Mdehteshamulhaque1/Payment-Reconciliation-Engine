import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, Search, ChevronRight } from 'lucide-react'

const transactions = [
  { id: 'TXN001', amount: '$5,240.50', status: 'matched', date: 'May 12, 2026', merchant: 'Tech Solutions Inc' },
  { id: 'TXN002', amount: '$1,850.00', status: 'matched', date: 'May 12, 2026', merchant: 'Cloud Services Ltd' },
  { id: 'TXN003', amount: '$3,125.75', status: 'pending', date: 'May 11, 2026', merchant: 'Global Payments' },
  { id: 'TXN004', amount: '$890.25', status: 'matched', date: 'May 11, 2026', merchant: 'Digital Ventures' },
  { id: 'TXN005', amount: '$2,450.00', status: 'resolved', date: 'May 10, 2026', merchant: 'Finance Corp' },
]

const statusColors = {
  matched: 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/20',
  pending: 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/20',
  resolved: 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/20',
}

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  )

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Transactions</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Transaction history</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Search, filter, and review a polished table layout designed for finance operations.</p>
          </div>
          <button className="btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by transaction ID or merchant..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="input-field pl-11"
            />
          </div>
          <button className="btn-secondary lg:w-40">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Merchant</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/40">
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.04 * index }}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-cyan-200">{transaction.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-200">{transaction.merchant}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{transaction.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[transaction.status]}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{transaction.date}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-400/30 hover:text-white">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="border-t border-white/10 p-10 text-center text-slate-400">No transactions found matching your search.</div>
          ) : null}
        </div>
      </motion.section>
    </div>
  )
}