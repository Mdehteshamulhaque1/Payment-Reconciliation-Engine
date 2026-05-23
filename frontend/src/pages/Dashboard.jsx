import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

const dashboardCards = [
  {
    title: 'Total Transactions',
    value: '12,450',
    change: '+12.5%',
    icon: BarChart3,
    color: 'from-blue-600 to-cyan-600'
  },
  {
    title: 'Match Rate',
    value: '99.85%',
    change: '+0.15%',
    icon: CheckCircle2,
    color: 'from-green-600 to-emerald-600'
  },
  {
    title: 'Discrepancies',
    value: '18',
    change: '-5 pending',
    icon: AlertCircle,
    color: 'from-orange-600 to-yellow-600'
  },
  {
    title: 'Processing Time',
    value: '2.3s',
    change: '-40% faster',
    icon: TrendingUp,
    color: 'from-purple-600 to-pink-600'
  }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-dark-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your reconciliation overview.</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {dashboardCards.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 card-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-600">{card.change}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-dark-900">{card.value}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-8 card-shadow">
              <h2 className="text-xl font-bold text-dark-900 mb-6">Transaction Volume</h2>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart will display here</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-dark-900">Transaction matched</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
