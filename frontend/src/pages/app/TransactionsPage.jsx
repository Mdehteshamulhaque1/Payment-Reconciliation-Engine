import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, ChevronDown, ChevronUp, X, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const GATEWAYS = ['Stripe', 'Razorpay', 'PayPal', 'UPI', 'PhonePe', 'Paytm']
const MERCHANT_DOMAINS = [
  'amazon.com',
  'netflix.com',
  'uber.com',
  'swiggy.com',
  'zomato.com',
  'spotify.com',
  'flipkart.com',
  'myntra.com',
  'bookmyshow.com',
  'paytm.com',
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function currencyINR(value) {
  return `₹${value.toLocaleString('en-IN')}`
}

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function generateTransactions(count = 20) {
  return Array.from({ length: count }, (_, index) => {
    const gateway = pick(GATEWAYS)
    const domain = pick(MERCHANT_DOMAINS)
    const amount = randInt(340, 98000)
    const confidenceSeed = Math.random()
    const status = confidenceSeed > 0.85 ? 'Pending' : confidenceSeed > 0.95 ? 'Failed' : 'Matched'

    return {
      id: `TXN-2026-${randInt(10000, 99999)}`,
      merchant: domain.replace('.com', '').replace(/-/g, ' '),
      domain,
      amount,
      gateway,
      status,
      date: new Date(Date.now() - randInt(0, 7 * 24 * 60 * 60 * 1000) - index * 1000 * 60 * 3).toISOString(),
    }
  })
}

function statusClass(status) {
  if (status === 'Matched') return 'bg-emerald-500 text-black'
  if (status === 'Pending') return 'bg-amber-400 text-black'
  return 'bg-red-500 text-white'
}

function gatewayLogoUrl(gateway) {
  const lookup = {
    Stripe: 'https://logo.clearbit.com/stripe.com',
    Razorpay: 'https://logo.clearbit.com/razorpay.com',
    PayPal: 'https://logo.clearbit.com/paypal.com',
    UPI: 'https://logo.clearbit.com/upi.com',
    PhonePe: 'https://logo.clearbit.com/phonepe.com',
    Paytm: 'https://logo.clearbit.com/paytm.com',
  }

  return lookup[gateway] || 'https://logo.clearbit.com/stripe.com'
}

export default function TransactionsPage() {
  const [transactions] = useState(() => generateTransactions(20))
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [gatewayFilter, setGatewayFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [selected, setSelected] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [drawerTxn, setDrawerTxn] = useState(null)

  const filteredTransactions = useMemo(() => {
    let rows = [...transactions]

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      rows = rows.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.merchant.toLowerCase().includes(q) ||
          row.domain.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'All') rows = rows.filter((row) => row.status === statusFilter)
    if (gatewayFilter !== 'All') rows = rows.filter((row) => row.gateway === gatewayFilter)
    if (dateFrom) rows = rows.filter((row) => new Date(row.date) >= new Date(dateFrom))
    if (dateTo) rows = rows.filter((row) => new Date(row.date) <= new Date(dateTo))
    if (minAmount) rows = rows.filter((row) => row.amount >= Number(minAmount))
    if (maxAmount) rows = rows.filter((row) => row.amount <= Number(maxAmount))

    rows.sort((a, b) => {
      const direction = sortDir === 'asc' ? 1 : -1
      if (sortField === 'amount') return (a.amount - b.amount) * direction
      if (sortField === 'merchant') return a.merchant.localeCompare(b.merchant) * direction
      if (sortField === 'date') return (new Date(a.date) - new Date(b.date)) * direction
      return 0
    })

    return rows
  }, [transactions, searchTerm, statusFilter, gatewayFilter, dateFrom, dateTo, minAmount, maxAmount, sortField, sortDir])

  const stats = useMemo(
    () => ({ total: 12480, matched: 12210, pending: 188, failed: 82 }),
    [],
  )

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const toggleSelect = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
    setGatewayFilter('All')
    setDateFrom('')
    setDateTo('')
    setMinAmount('')
    setMaxAmount('')
  }

  const exportToast = () => {
    toast.loading('Generating export...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('CSV export ready (mock)')
    }, 900)
  }

  const bulkToast = (message) => toast.success(message)

  const visibleRows = filteredTransactions

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Transactions</h1>
          <p className="text-sm text-slate-400">Search, filter, and review the reconciliation ledger</p>
        </div>

        <button type="button" onClick={exportToast} className="btn-secondary">
          <Download size={18} />
          Export
        </button>
      </div>

      <section className="panel-surface p-4 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search merchant, domain, or TXN ID"
              className="ml-2 w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-400"
            />
          </div>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="lg:col-span-2 input-field">
            <option>All</option>
            <option>Matched</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>

          <select value={gatewayFilter} onChange={(event) => setGatewayFilter(event.target.value)} className="lg:col-span-2 input-field">
            <option>All</option>
            {GATEWAYS.map((gateway) => (
              <option key={gateway}>{gateway}</option>
            ))}
          </select>

          <div className="lg:col-span-2 flex gap-2">
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="input-field" />
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="input-field" />
          </div>

          <div className="lg:col-span-2 flex gap-2">
            <input type="number" placeholder="Min" value={minAmount} onChange={(event) => setMinAmount(event.target.value)} className="input-field" />
            <input type="number" placeholder="Max" value={maxAmount} onChange={(event) => setMaxAmount(event.target.value)} className="input-field" />
          </div>

          <div className="lg:col-span-1 flex lg:justify-end">
            <button type="button" onClick={clearFilters} className="btn-ghost w-full lg:w-auto">
              Clear
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Total</div>
          <div className="mt-2 font-dmMono text-lg text-white">{stats.total.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Matched</div>
          <div className="mt-2 font-dmMono text-lg text-white">{stats.matched.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Pending</div>
          <div className="mt-2 font-dmMono text-lg text-white">{stats.pending.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Failed</div>
          <div className="mt-2 font-dmMono text-lg text-white">{stats.failed.toLocaleString()}</div>
        </div>
      </div>

      <section className="panel-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-400">
              <tr>
                <th className="px-4 py-4">
                  <input type="checkbox" checked={selectAll} onChange={(event) => {
                    const checked = event.target.checked
                    setSelectAll(checked)
                    setSelected(checked ? visibleRows.map((row) => row.id) : [])
                  }} />
                </th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => toggleSort('merchant')}>
                  Merchant {sortField === 'merchant' && (sortDir === 'asc' ? <ChevronUp className="inline" size={14} /> : <ChevronDown className="inline" size={14} />)}
                </th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => toggleSort('id')}>
                  TXN ID {sortField === 'id' && (sortDir === 'asc' ? <ChevronUp className="inline" size={14} /> : <ChevronDown className="inline" size={14} />)}
                </th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => toggleSort('amount')}>
                  Amount {sortField === 'amount' && (sortDir === 'asc' ? <ChevronUp className="inline" size={14} /> : <ChevronDown className="inline" size={14} />)}
                </th>
                <th className="px-4 py-4">Gateway</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => toggleSort('date')}>
                  Date {sortField === 'date' && (sortDir === 'asc' ? <ChevronUp className="inline" size={14} /> : <ChevronDown className="inline" size={14} />)}
                </th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/30 text-sm">
              {visibleRows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-white/5" onClick={() => setDrawerTxn(row)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://logo.clearbit.com/${row.domain}`} alt={row.domain} className="h-8 w-8 rounded-lg" />
                      <div>
                        <div className="font-medium text-white">{row.merchant}</div>
                        <div className="text-xs text-slate-400">{row.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-dmMono text-white">{row.id}</td>
                  <td className="px-4 py-4 font-dmMono text-white">{currencyINR(row.amount)}</td>
                  <td className="px-4 py-4">
                    <img src={gatewayLogoUrl(row.gateway)} alt={row.gateway} className="h-8 w-8 rounded-lg" />
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{formatDate(row.date)}</td>
                  <td className="px-4 py-4 text-center">
                    <button type="button" onClick={(event) => { event.stopPropagation(); setDrawerTxn(row) }} className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10">
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Showing 1-20 of 12,480 transactions</div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost py-2 px-3">Prev</button>
          <button className="btn-ghost py-2 px-3">1</button>
          <button className="btn-ghost py-2 px-3">2</button>
          <button className="btn-ghost py-2 px-3">Next</button>
        </div>
      </div>

      <AnimatePresence>
        {selected.length > 0 ? (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 z-50 flex w-[min(1000px,calc(100%-2rem))] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[rgba(8,15,29,0.96)] px-4 py-3 shadow-2xl"
          >
            <div className="text-sm text-white">{selected.length} transactions selected</div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => bulkToast('Resolved selected transactions (mock)')} className="btn-primary py-2 px-4">Resolve All</button>
              <button type="button" onClick={() => bulkToast('Selected export generated (mock)')} className="btn-ghost py-2 px-4">Export Selected</button>
              <button type="button" onClick={() => bulkToast('Flagged selected rows (mock)')} className="btn-ghost py-2 px-4">Flag as Exception</button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {drawerTxn ? (
          <motion.aside
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[rgba(8,15,29,0.98)] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={`https://logo.clearbit.com/${drawerTxn.domain}`} alt={drawerTxn.domain} className="h-10 w-10 rounded-xl" />
                <div>
                  <div className="text-lg font-semibold text-white">{drawerTxn.merchant}</div>
                  <div className="text-xs text-slate-400">{drawerTxn.domain}</div>
                </div>
              </div>
              <button type="button" onClick={() => setDrawerTxn(null)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">TXN ID</div>
                <div className="mt-1 font-dmMono text-white">{drawerTxn.id}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Amount</div>
                <div className="mt-1 font-dmMono text-2xl text-white">{currencyINR(drawerTxn.amount)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Gateway</div>
                <div className="mt-2 flex items-center gap-3">
                  <img src={gatewayLogoUrl(drawerTxn.gateway)} alt={drawerTxn.gateway} className="h-10 w-10 rounded-xl" />
                  <div className="text-white">{drawerTxn.gateway}</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</div>
                <div className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(drawerTxn.status)}`}>
                  {drawerTxn.status}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Date</div>
                <div className="mt-1 text-white">{formatDate(drawerTxn.date)}</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button type="button" className="btn-primary flex-1" onClick={() => toast.success('Reconciled (mock)')}>
                  Reconcile
                </button>
                <button type="button" className="btn-ghost flex-1" onClick={() => toast('Flagged as exception (mock)')}>
                  Flag as Exception
                </button>
              </div>

              <button type="button" className="text-sm text-slate-400 underline-offset-4 hover:text-white hover:underline" onClick={() => toast('Audit trail opened (mock)')}>
                View Audit Trail
              </button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
