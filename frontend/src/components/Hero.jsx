import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, X, BarChart3, Zap, Shield } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../animations/motionVariants'
import { useState } from 'react'

const reconciliationToneClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200',
  green: 'from-green-50 to-green-100 border-green-200',
  amber: 'from-amber-50 to-amber-100 border-amber-200'
}

const DemoModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const dashboardViews = {
    dashboard: {
      title: 'Real-time Dashboard',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          {/* Header Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Transactions', value: '24,856', change: '+12.5%', color: 'bg-blue-500' },
              { label: 'Matched', value: '24,721', change: '+0.2%', color: 'bg-green-500' },
              { label: 'Mismatches', value: '135', change: '-8.3%', color: 'bg-orange-500' },
              { label: 'Processing', value: '12.4s', change: '-3.1%', color: 'bg-purple-500' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-3 rounded-lg border border-gray-200"
              >
                <div className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-10 mb-2 flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Transaction ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Gateway</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {['TXN-2024-001', 'TXN-2024-002', 'TXN-2024-003', 'TXN-2024-004'].map((txn, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 font-mono text-blue-600">{txn}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900">${(Math.random() * 10000).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {['Stripe', 'Razorpay', 'PayPal', 'UPI'][i]}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ Matched</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    analytics: {
      title: 'Analytics & Insights',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          {/* Chart Placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-end gap-2 h-32">
              {[65, 78, 72, 85, 92, 88, 95].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg opacity-80"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Success Rate Trend (Last 7 Days)</p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Avg Match Time', value: '234ms', icon: Zap },
              { label: 'Accuracy Rate', value: '99.87%', icon: Shield },
              { label: 'Failed Matches', value: '0.13%', icon: TrendingUp },
              { label: 'API Uptime', value: '99.99%', icon: Shield }
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3"
              >
                <metric.icon size={16} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    reconciliation: {
      title: 'Reconciliation Report',
      icon: Shield,
      content: (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Processed', value: '45,320', color: 'blue' },
              { label: 'Successfully Matched', value: '45,185', color: 'green' },
              { label: 'Requires Review', value: '135', color: 'amber' }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${reconciliationToneClasses[card.color]} rounded-lg p-4`}
              >
                <p className="text-xs text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Issues List */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Issues Detected</h4>
            {['Duplicate transaction detected', 'Gateway timeout recovered', 'Settlement mismatch resolved', 'Rate limit approached'].map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-xs text-gray-700">{issue}</p>
                <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Resolved</span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  }

  const currentView = dashboardViews[activeTab]

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PayFlow Demo</h2>
            <p className="text-sm text-gray-500">Interactive demo of the reconciliation dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex gap-2 pt-4">
          {Object.entries(dashboardViews).map(([key, view]) => {
            const Icon = view.icon
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="capitalize">{key}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentView.content}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">This is a live interactive demo of PayFlow's core features</p>
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Explore Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-50 border border-blue-200"
          >
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Smart Payment Reconciliation</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 text-dark-900 leading-tight"
          >
            Reconcile Payments <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              With Precision
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Automate your payment reconciliation process with AI-powered insights. Match transactions effortlessly and eliminate discrepancies in real-time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </Link>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="btn-secondary"
            >
              Watch Demo
            </button>
          </motion.div>

          {/* Hero Image Placeholder */}
          <motion.div
            variants={fadeInUp}
            className="relative mt-16 rounded-3xl overflow-hidden shadow-2xl border border-white/70"
          >
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 aspect-video flex items-center justify-center px-6 py-8">
              <div className="w-full max-w-5xl grid grid-cols-12 gap-4 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-12 md:col-span-7 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Live Reconciliation Pulse</p>
                      <h3 className="text-2xl font-semibold mt-2">Operations command center</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-200 text-xs font-medium border border-emerald-300/20">
                      Sync active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Match rate', value: '99.87%' },
                      { label: 'Latency', value: '234ms' },
                      { label: 'Alerts', value: '02 open' }
                    ].map((item, index) => (
                      <div key={index} className="rounded-xl bg-white/10 border border-white/10 p-4">
                        <p className="text-xs text-cyan-100/70">{item.label}</p>
                        <p className="text-xl font-bold mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400"
                        animate={{ x: [0, 12, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-cyan-100/75">
                      <span>Auto-matching invoices, payouts, and settlements</span>
                      <span>12 streams monitored</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="col-span-12 md:col-span-5 rounded-2xl bg-slate-900/90 border border-white/10 p-5 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-white/80">Smart event stream</p>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-blue-400/15 text-blue-200 border border-blue-300/20">Realtime</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: 'Stripe payout matched', tone: 'bg-emerald-400' },
                      { title: 'Razorpay settlement queued', tone: 'bg-amber-400' },
                      { title: 'Duplicate flagged for review', tone: 'bg-rose-400' }
                    ].map((row, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.08 }}
                        className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3"
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${row.tone}`} />
                        <div className="flex-1">
                          <p className="text-sm">{row.title}</p>
                          <p className="text-xs text-white/50">Processed just now</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-300/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">Toggle View</p>
                    <div className="mt-3 flex gap-2">
                      {['Dashboard', 'Ledger', 'Risk'].map((label, index) => (
                        <button
                          key={label}
                          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${index === 0 ? 'bg-white text-slate-950' : 'bg-white/10 text-white/70 hover:bg-white/10'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </section>
  )
}
